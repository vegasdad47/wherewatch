import "next-auth";
import "next-auth/jwt";
import type { UserTier } from "@/lib/supabase";

declare module "next-auth" {
  interface User { tier?: UserTier }
  interface Session { user: { id: string; tier: UserTier; name?: string | null; email?: string | null; image?: string | null } }
}

declare module "next-auth/jwt" {
  interface JWT { tier?: UserTier }
}
