import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { name?: string; email?: string; password?: string } | null;
  const name = body?.name?.trim() || null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });
  }
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: "Authentication is not configured yet." }, { status: 503 });

  const { error } = await db.from("users").insert({ name, email, password_hash: await hash(password, 12), tier: "free" });
  if (error?.code === "23505") return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  if (error) return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
