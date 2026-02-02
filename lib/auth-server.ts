import "server-only";

import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";

import { authOptions, type UserRole } from "@/lib/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin(allowedRoles?: UserRole[]) {
  const session = await getSession();
  if (!session || (session as any).userType !== "admin") redirect("/admin/login");

  const role = (session.user as any).role as UserRole | undefined;
  if (allowedRoles && (!role || !allowedRoles.includes(role))) notFound();

  return session;
}

export async function requireClient() {
  const session = await getSession();
  if (!session || (session as any).userType !== "client") redirect("/login");
  return session;
}

