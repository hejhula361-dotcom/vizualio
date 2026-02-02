import "server-only";

import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type UserRole = "superadmin" | "admin" | "editor";
export type UserType = "admin" | "client";

function parseAllowlist(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(
    value
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

const adminEmailAllowlist = parseAllowlist(process.env.ADMIN_EMAIL_ALLOWLIST);

function isAdminEmailAllowed(email: string): boolean {
  if (adminEmailAllowlist.size === 0) return false;
  return adminEmailAllowlist.has(email.trim().toLowerCase());
}

async function upsertAdminUser(params: { email: string; name?: string | null; image?: string | null }) {
  const supabase = getSupabaseAdmin();
  const email = params.email.trim().toLowerCase();

  // Najdi existujícího uživatele.
  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("id, role")
    .eq("email", email)
    .maybeSingle();

  if (existingError) throw existingError;

  const now = new Date().toISOString();

  if (existing) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: params.name ?? null,
        image_url: params.image ?? null,
        last_login_at: now,
        updated_at: now
      })
      .eq("id", existing.id);
    if (updateError) throw updateError;
    return { userId: existing.id as string, role: existing.role as UserRole };
  }

  // Bootstrap: první admin v DB -> superadmin
  const { count, error: countError } = await supabase.from("users").select("id", { count: "exact", head: true });
  if (countError) throw countError;
  const role: UserRole = (count ?? 0) === 0 ? "superadmin" : "admin";

  const { data: inserted, error: insertError } = await supabase
    .from("users")
    .insert({
      email,
      name: params.name ?? null,
      image_url: params.image ?? null,
      role,
      created_at: now,
      updated_at: now,
      last_login_at: now
    })
    .select("id, role")
    .single();

  if (insertError) throw insertError;
  return { userId: inserted.id as string, role: inserted.role as UserRole };
}

async function verifyClientCredentials(username: string, password: string) {
  const supabase = getSupabaseAdmin();
  const uname = username.trim();

  const { data: authRow, error: authError } = await supabase
    .from("client_auth")
    .select("id, client_id, password_hash")
    .eq("username", uname)
    .maybeSingle();

  if (authError) throw authError;
  if (!authRow) return null;

  const ok = await compare(password, authRow.password_hash as string);
  if (!ok) return null;

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, status")
    .eq("id", authRow.client_id)
    .single();

  if (clientError) throw clientError;
  if (!client) return null;
  if ((client.status ?? "active") !== "active") return null;

  return {
    id: String(authRow.id),
    name: String(client.name ?? uname),
    email: client.email ? String(client.email) : undefined,
    clientId: String(client.id),
    userType: "client" as const
  };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Client",
      credentials: {
        username: { label: "Uživatelské jméno", type: "text" },
        password: { label: "Heslo", type: "password" }
      },
      authorize: async (credentials) => {
        const username = credentials?.username?.toString() ?? "";
        const password = credentials?.password?.toString() ?? "";
        if (!username || !password) return null;
        return await verifyClientCredentials(username, password);
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        const email = user.email?.toLowerCase();
        if (!email) return false;
        return isAdminEmailAllowed(email);
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // GitHub admin
      if (account?.provider === "github") {
        token.userType = "admin";
        if (user?.email) token.email = user.email;

        // pouze při prvním sign-in (když je k dispozici user objekt)
        if (user?.email) {
          const { userId, role } = await upsertAdminUser({
            email: user.email,
            name: user.name,
            image: user.image
          });
          token.userId = userId;
          token.role = role;
        }
      }

      // Client credentials
      if (account?.provider === "credentials" && user) {
        token.userType = "client";
        token.clientAuthId = user.id;
        token.clientId = (user as any).clientId;
      }

      return token;
    },
    async session({ session, token }) {
      (session as any).userType = token.userType as UserType | undefined;

      if (token.userType === "admin") {
        (session.user as any).id = (token as any).userId ?? token.sub;
        (session.user as any).role = (token as any).role as UserRole | undefined;
      }

      if (token.userType === "client") {
        (session.user as any).id = (token as any).clientAuthId ?? token.sub;
        (session.user as any).clientId = (token as any).clientId as string | undefined;
      }

      return session;
    }
  }
};

