"use client";

import { AdminMenuProvider } from "@/app/context/AdminMenuContext";
import { SectionColorProvider } from "@/app/context/SectionColorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SectionColorProvider>
      <AdminMenuProvider>{children}</AdminMenuProvider>
    </SectionColorProvider>
  );
}




