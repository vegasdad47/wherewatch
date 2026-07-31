-- Run this once in the Supabase SQL editor.
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS & SUBSCRIPTIONS
-- ============================================================

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  image text,
  password_hash text,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  stripe_price_id text,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ============================================================
-- USER STREAMING SERVICES (which services does the user have?)
-- ============================================================

create table if not exists public.user_services (
  user_id uuid not null references public.users(id) on delete cascade,
  provider_id integer not null,
  provider_name text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, provider_id)
);

-- ============================================================
-- WATCHLIST
-- ============================================================

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  added_at timestamptz not null default now(),
  notified_at timestamptz, -- last time we told them it's available
  unique (user_id, tmdb_id, media_type)
);

create index if not exists watchlist_user_id_idx on public.watchlist(user_id);

-- ============================================================
-- TRENDING ENGINE — raw events
-- ============================================================

create table if not exists public.trending_events (
  id bigint generated always as identity primary key,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  event_type text not null check (event_type in ('search', 'click', 'watchlist_add', 'watchlist_remove')),
  user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists trending_events_type_created_idx
  on public.trending_events (event_type, created_at desc);

create index if not exists trending_events_tmdb_idx
  on public.trending_events (tmdb_id, media_type);

-- ============================================================
-- TRENDING ENGINE — materialized scores (refreshed periodically)
-- ============================================================

create table if not exists public.trending_scores (
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  score numeric(10,4) not null default 0,
  search_count integer not null default 0,
  click_count integer not null default 0,
  watchlist_add_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tmdb_id, media_type)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_services enable row level security;
alter table public.watchlist enable row level security;
alter table public.trending_events enable row level security;
alter table public.trending_scores enable row level security;

-- Users can only see their own data
create policy "Users can manage their own services"
  on public.user_services for all
  using (auth.uid() = user_id);

create policy "Users can manage their own watchlist"
  on public.watchlist for all
  using (auth.uid() = user_id);

-- Trending events: anyone can read, only authenticated can insert
create policy "Anyone can read trending events"
  on public.trending_events for select
  using (true);

create policy "Authenticated users can insert trending events"
  on public.trending_events for insert
  with check (auth.role() = 'authenticated');

-- Trending scores: public read
create policy "Anyone can read trending scores"
  on public.trending_scores for select
  using (true);

-- ============================================================
-- FUNCTION: Calculate trending scores with time decay
-- Run this via a cron job (e.g., every 15 minutes)
-- ============================================================

create or replace function public.refresh_trending_scores()
returns void as $$
declare
  now_ts timestamptz := now();
begin
  -- Clear current scores
  delete from public.trending_scores;

  -- Insert fresh scores with exponential time decay
  -- Half-life: 24 hours for searches, 48 hours for clicks, 72 hours for watchlist adds
  insert into public.trending_scores (tmdb_id, media_type, score, search_count, click_count, watchlist_add_count, updated_at)
  select
    tmdb_id,
    media_type,
    sum(weight) as score,
    coalesce(sum(case when event_type = 'search' then 1 else 0 end), 0) as search_count,
    coalesce(sum(case when event_type = 'click' then 1 else 0 end), 0) as click_count,
    coalesce(sum(case when event_type = 'watchlist_add' then 1 else 0 end), 0) as watchlist_add_count,
    now_ts as updated_at
  from (
    select
      tmdb_id,
      media_type,
      event_type,
      case
        when event_type = 'search' then
          3.0 * exp(extract(epoch from (created_at - now_ts)) / (86400.0 * 1.0) * ln(0.5))
        when event_type = 'click' then
          5.0 * exp(extract(epoch from (created_at - now_ts)) / (86400.0 * 2.0) * ln(0.5))
        when event_type = 'watchlist_add' then
          10.0 * exp(extract(epoch from (created_at - now_ts)) / (86400.0 * 3.0) * ln(0.5))
        else 0
      end as weight
    from public.trending_events
    where created_at > now_ts - interval '7 days'
  ) sub
  group by tmdb_id, media_type
  having sum(weight) > 0.01;

  -- Clean up events older than 30 days
  delete from public.trending_events where created_at < now_ts - interval '30 days';
end;
$$ language plpgsql security definer;
