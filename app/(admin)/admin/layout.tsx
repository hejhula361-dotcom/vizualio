import type { Metadata } from "next";

import { AdminShell } from "./_components/AdminShell";
import { requireAdmin } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin | Vizualio",
  description: "Administrace Vizualio"
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const role = ((session.user as any).role ?? "admin") as "superadmin" | "admin" | "editor";

  return (
    <AdminShell role={role} userEmail={session.user.email ?? null}>
      {children}
    </AdminShell>
  );
}

