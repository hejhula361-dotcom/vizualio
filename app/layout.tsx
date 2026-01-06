import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Vizualio — Fotorealistické 3D vizualizace",
  description: "Luxusní 3D vizualizace interiérů, exteriérů a produktů.",
  icons: {
    icon: "/img/logo.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${inter.variable} ${grotesk.variable}`} suppressHydrationWarning>
      <body className="bg-carbon text-offwhite min-h-screen dark:bg-carbon dark:text-offwhite bg-light-bg text-light-text">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

