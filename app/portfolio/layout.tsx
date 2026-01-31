import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Vizualio — Fotorealistické 3D vizualizace",
  description:
    "Ukázky našich 3D vizualizací – interiéry, exteriéry i půdorysy. Profesionální vizualizace pro realitky, developery a interiéry."
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
