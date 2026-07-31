import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getSupabaseAdmin, UserTier } from "@/lib/supabase";

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";
        const db = getSupabaseAdmin();
        if (!email || !password || !db) return null;

        const { data } = await db.from("users").select("*").eq("email", email).maybeSingle();
        if (!data?.password_hash || !(await compare(password, data.password_hash))) return null;
        return { id: data.id, email: data.email, name: data.name, image: data.image, tier: data.tier ?? "free" };
      },
    }),
    ...(googleEnabled
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      const db = getSupabaseAdmin();
      if (!db || !user.email) return false;

      const email = user.email.toLowerCase();
      const { data: existing } = await db.from("users").select("id").eq("email", email).maybeSingle();
      if (existing) {
        await db.from("users").update({ name: user.name, image: user.image, updated_at: new Date().toISOString() }).eq("id", existing.id);
        user.id = existing.id;
      } else {
        const { data, error } = await db.from("users").insert({ email, name: user.name, image: user.image, tier: "free" }).select("id").single();
        if (error || !data) return false;
        user.id = data.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.tier = (user as { tier?: UserTier }).tier ?? "free";
      }
      if (token.sub) {
        const db = getSupabaseAdmin();
        if (db) {
          const { data } = await db.from("users").select("tier").eq("id", token.sub).maybeSingle();
          if (data?.tier) token.tier = data.tier;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.tier = (token.tier as UserTier) ?? "free";
      }
      return session;
    },
  },
});
