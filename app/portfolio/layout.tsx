import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio 3D vizualizací | Domy, kuchyně, rekonstrukce | Vizualio",
  description:
    "Ukázky fotorealistických 3D vizualizací rodinných domů, kuchyní, rekonstrukcí i projektů pro realitní kanceláře."
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
