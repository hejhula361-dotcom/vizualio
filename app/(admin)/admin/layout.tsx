import type { Metadata } from "next";

import { AdminNav } from "@/app/admin/_components/AdminNav";
import { requireAdmin } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin | Vizualio",
  description: "Administrace Vizualio"
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const role = ((session.user as any).role ?? "admin") as "superadmin" | "admin" | "editor";

  return (
    <div className="grid min-h-[80vh] grid-cols-[260px,1fr] bg-carbon">
      <aside className="flex flex-col border-r border-white/10 bg-charcoal/80 backdrop-blur-lg">
        <div className="border-b border-white/5 p-5">
          <h1 className="font-semibold tracking-tight text-offwhite">Vizualio Admin</h1>
          <p className="mt-1 truncate text-sm text-stone" title={session.user.email ?? ""}>
            {session.user.email}
          </p>
          <span className="mt-2 inline-flex rounded-full border border-champagne/30 bg-champagne/10 px-2.5 py-0.5 text-xs font-medium text-champagne">
            {role}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-3">
          <AdminNav role={role} />
        </div>
      </aside>
      <main className="min-w-0 p-8">{children}</main>
    </div>
  );
}

