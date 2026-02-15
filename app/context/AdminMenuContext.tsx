"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type AdminMenuContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isAdmin: boolean;
};

const AdminMenuContext = createContext<AdminMenuContextValue | null>(null);

export function AdminMenuProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) setMenuOpen(false);
  }, [isAdmin]);

  const value: AdminMenuContextValue = {
    menuOpen: isAdmin ? menuOpen : false,
    setMenuOpen: useCallback(
      (arg: boolean | ((prev: boolean) => boolean)) => {
        if (isAdmin) {
          setMenuOpen(arg);
        }
      },
      [isAdmin]
    ),
    isAdmin
  };

  return <AdminMenuContext.Provider value={value}>{children}</AdminMenuContext.Provider>;
}

export function useAdminMenu() {
  const ctx = useContext(AdminMenuContext);
  return ctx ?? { menuOpen: false, setMenuOpen: () => {}, isAdmin: false };
}
