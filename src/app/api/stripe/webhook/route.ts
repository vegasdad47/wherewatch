import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !secret || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });

  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object;
    const userId = checkout.metadata?.userId ?? checkout.client_reference_id;
    if (userId && typeof checkout.customer === "string") {
      await db.from("users").update({ stripe_customer_id: checkout.customer, tier: "premium", updated_at: new Date().toISOString() }).eq("id", userId);
    }
  }

  if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;
    console.log("Webhook subscription event:", { type: event.type, status: subscription.status, userId, metadata: subscription.metadata });
    if (userId) {
      const premium = ["active", "trialing"].includes(subscription.status);
      const item = subscription.items.data[0];
      await db.from("subscriptions").upsert({
        stripe_subscription_id: subscription.id,
        user_id: userId,
        stripe_customer_id: String(subscription.customer),
        stripe_price_id: item?.price.id ?? null,
        status: subscription.status,
        current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, { onConflict: "stripe_subscription_id" });
      await db.from("users").update({ tier: premium ? "premium" : "free", updated_at: new Date().toISOString() }).eq("id", userId);
    }
  }
  return NextResponse.json({ received: true });
}
