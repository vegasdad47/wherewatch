import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
  const stripe = getStripe();
  const price = process.env.STRIPE_PRICE_ID;
  const db = getSupabaseAdmin();
  if (!stripe || !price || !db) {
    console.error("Checkout config missing:", { hasStripe: !!stripe, hasPrice: !!price, hasDb: !!db });
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  }

  try {
    const { data: user } = await db.from("users").select("email,stripe_customer_id,tier").eq("id", session.user.id).single();
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (user.tier === "premium") return NextResponse.json({ error: "You already have Premium." }, { status: 409 });

    const origin = new URL(request.url).origin;
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      customer: user.stripe_customer_id || undefined,
      customer_email: user.stripe_customer_id ? undefined : user.email,
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id },
      subscription_data: { metadata: { userId: session.user.id } },
      allow_promotion_codes: true,
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/account?checkout=cancelled`,
    });
    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.message || String(err));
    return NextResponse.json({ error: "Billing is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
