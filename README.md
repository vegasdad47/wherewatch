# Streaming Finder

A dark, mobile-first Next.js app for finding where movies and TV shows are available to stream, rent, or buy. Data comes from TMDB and watch availability is powered by JustWatch.

## Setup

1. Create a free TMDB API key at <https://www.themoviedb.org/settings/api>.
2. Copy the variables from `.env.example` into `.env.local`. TMDB is the only requirement for browsing; Supabase, Auth.js, Google, Stripe, and AdSense enable the Session 3 account and monetization features.

   ```env
   TMDB_API_KEY=your_real_key
   ```

3. Start the app:

   ```bash
   corepack pnpm dev
   ```

Then open <http://localhost:3000>.

## Authentication and billing

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Create a recurring Stripe Price and set `STRIPE_PRICE_ID`.
3. Point a Stripe webhook at `/api/stripe/webhook` and subscribe it to Checkout completion and subscription created, updated, and deleted events.
4. For Google OAuth, use `/api/auth/callback/google` as the callback path.

Email/password and Google authentication are handled by Auth.js. The Supabase service-role key remains server-only. Free visitors see responsive ad placements; Premium users see none. Until AdSense environment variables are set, development uses clearly labeled ad placeholders.

## Commands

```bash
corepack pnpm lint
corepack pnpm build
corepack pnpm start
```

The API key stays server-side. Search responses are cached for one hour; details, credits, and watch providers for 24 hours.
