import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stripe = getStripe();
  const db = getSupabaseAdmin();
  if (!stripe || !db) return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  const { data } = await db.from("users").select("stripe_customer_id").eq("id", session.user.id).single();
  if (!data?.stripe_customer_id) return NextResponse.json({ error: "No billing account found." }, { status: 404 });
  const portal = await stripe.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${new URL(request.url).origin}/account` });
  return NextResponse.json({ url: portal.url });
}
