"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Inbox, LayoutDashboard, LogOut, Shield, type LucideIcon } from "lucide-react";

type UserRole = "superadmin" | "admin" | "editor";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  minRole?: UserRole;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Přehled", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Poptávky", icon: Inbox },
  { href: "/admin/users", label: "Uživatelé", icon: Shield, minRole: "superadmin" }
];

function hasAccess(role: UserRole, minRole?: UserRole) {
  if (!minRole) return true;
  if (role === "superadmin") return true;
  return role === minRole;
}

export function AdminNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems
        .filter((i) => hasAccess(role, i.minRole))
        .map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-white/10 text-offwhite" : "text-offwhite/80 hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 text-champagne" />
              {item.label}
            </Link>
          );
        })}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-offwhite/80 transition hover:bg-white/5"
      >
        <LogOut className="h-4 w-4 text-champagne" />
        Odhlásit se
      </button>
    </nav>
  );
}

