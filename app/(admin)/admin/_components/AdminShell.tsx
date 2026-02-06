"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminNav } from "@/app/admin/_components/AdminNav";

type UserRole = "superadmin" | "admin" | "editor";

type AdminShellProps = {
  role: UserRole;
  userEmail: string | null;
  children: React.ReactNode;
};

export function AdminShell({ role, userEmail, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Zavřít menu po navigaci (klik na odkaz)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <>
      <div className="border-b border-white/5 p-5">
        <h1 className="font-semibold tracking-tight text-offwhite">Vizualio Admin</h1>
        <p className="mt-1 truncate text-sm text-stone" title={userEmail ?? ""}>
          {userEmail}
        </p>
        <span className="mt-2 inline-flex rounded-full border border-champagne/30 bg-champagne/10 px-2.5 py-0.5 text-xs font-medium text-champagne">
          {role}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        <AdminNav role={role} />
      </div>
    </>
  );

  return (
    <div className="grid min-h-[80vh] grid-cols-1 bg-carbon md:grid-cols-[260px,1fr]">
      {/* Mobile: horní lišta s hamburgerem */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-charcoal/90 px-4 py-3 backdrop-blur-lg md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-offwhite/90 transition hover:bg-white/10"
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="font-semibold tracking-tight text-offwhite">Vizualio Admin</span>
      </div>

      {/* Mobile: overlay při otevřeném menu */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Zavřít menu"
        />
      )}

      {/* Sidebar: na mobilu jako vysouvací panel, na desktopu běžně */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[85vw] flex-col border-r border-white/10 bg-charcoal/95 shadow-xl backdrop-blur-lg
          transition-transform duration-200 ease-out
          md:static md:max-w-none md:translate-x-0 md:shadow-none
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!menuOpen}
      >
        {sidebarContent}
      </aside>

      {/* Hlavní obsah */}
      <main className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
