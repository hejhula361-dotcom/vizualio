"use client";

import { LeadProvider } from "@/app/context/LeadContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LeadProvider>{children}</LeadProvider>;
}




