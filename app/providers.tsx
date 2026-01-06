"use client";

import { LeadProvider } from "@/app/context/LeadContext";
import { ThemeProvider } from "@/app/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LeadProvider>{children}</LeadProvider>
    </ThemeProvider>
  );
}




