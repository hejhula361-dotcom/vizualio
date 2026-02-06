"use client";

import { SectionColorProvider } from "@/app/context/SectionColorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SectionColorProvider>{children}</SectionColorProvider>;
}




