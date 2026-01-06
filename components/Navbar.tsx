"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "#sluzby", label: "Služby" },
  { href: "#proc", label: "Proč my" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#cenik", label: "Ceník" },
  { href: "#kontakt", label: "Kontakt" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-carbon/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/img/logo.svg" alt="Vizualio" width={48} height={48} className="h-28 w-28" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-stone md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-offwhite"
              scroll={true}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <motion.a
          href="#kontakt"
          whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(198, 166, 124, 0.35)" }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
        >
          Spolupracovat
        </motion.a>
      </div>
    </header>
  );
}


