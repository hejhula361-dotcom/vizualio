import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Providers } from "@/app/providers";
import { SupabasePreconnect } from "@/components/SupabasePreconnect";
import { buildDefaultMetadata } from "@/lib/seo";

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

export const metadata: Metadata = buildDefaultMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`scroll-smooth scroll-pt-20 ${inter.variable} ${grotesk.variable}`}>
      <body className="bg-carbon text-offwhite min-h-screen">
        <SupabasePreconnect />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}

