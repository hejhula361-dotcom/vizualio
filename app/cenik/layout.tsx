import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ceník | Vizualio — Fotorealistické 3D vizualizace",
  description:
    "Ceník 3D vizualizací interiérů, exteriérů a půdorysů. Profesionální vizualizace pro realitky, developery a interiéry."
};

export default function CenikLayout({ children }: { children: React.ReactNode }) {
  return children;
}
