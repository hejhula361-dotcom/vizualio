"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Mail, Phone } from "lucide-react";
import { useSectionColor } from "@/app/context/SectionColorContext";

const navLinks = [
  { href: "#proc", label: "Proč my" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/cenik", label: "Ceník" },
  { href: "#kontakt", label: "Kontakt" }
];

const MOBILE_EMAIL = "info@vizualio.cz";
const MOBILE_PHONE_1 = "721 369 070";
const MOBILE_PHONE_2 = "725 486 505";

function HamburgerIcon({ open }: { open: boolean }) {
  // Stejný rozestup: středy čar na 6px, 12px, 18px (v 24px boxu) → top 5px, 11px, 17px
  return (
    <div className="relative h-6 w-6 flex-shrink-0">
      {/* Horní čára → horní větev šipky doprava (>) */}
      <motion.span
        className="absolute left-0 top-[5px] h-0.5 w-6 rounded-full bg-offwhite origin-right"
        initial={false}
        animate={{ rotate: open ? -45 : 0 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      />
      {/* Prostřední čára mizí */}
      <motion.span
        className="absolute left-0 top-[11px] h-0.5 w-6 rounded-full bg-offwhite origin-center"
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* Dolní čára → dolní větev šipky doprava (>) */}
      <motion.span
        className="absolute left-0 top-[17px] h-0.5 w-6 rounded-full bg-offwhite origin-right"
        initial={false}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { displayColor } = useSectionColor();
  const isOnCenik = pathname === "/cenik";
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isAccount = pathname?.startsWith("/account") ?? false;
  const isAuth = pathname === "/login" || pathname === "/admin/login";
  const isPortal = isAdmin || isAccount || isAuth;

  const closeMenu = () => setMenuOpen(false);

  if (isPortal) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-carbon/70 backdrop-blur-lg w-full">
        <div className="flex w-full items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Vizualio – úvod">
            <span className="logo-gold h-28 w-28 flex-shrink-0" role="img" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-2">
            {isAccount && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-offwhite transition hover:border-champagne/60 hover:text-champagne inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Odhlásit se
              </button>
            )}
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-offwhite transition hover:border-champagne hover:text-champagne"
            >
              Zpět na web
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-carbon/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Vizualio – úvod">
            <span
              className="logo-gold h-28 w-28 flex-shrink-0 transition-colors duration-300"
              style={isOnCenik ? { backgroundColor: displayColor } : undefined}
              role="img"
              aria-hidden="true"
            />
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
          {/* Desktop: tlačítko Spolupracovat */}
          <motion.a
            href="#kontakt"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`hidden md:inline-flex rounded-full px-4 py-2 text-carbon text-sm font-medium transition ${
              isOnCenik ? "hover:opacity-90" : "bg-champagne shadow-glow hover:bg-amber"
            }`}
            style={
              isOnCenik
                ? {
                    backgroundColor: displayColor,
                    boxShadow: `0 0 24px ${displayColor}40`
                  }
                : undefined
            }
          >
            Spolupracovat
          </motion.a>
          {/* Mobile: hamburger – jen ikona, bez pozadí */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center p-2 -mr-1 touch-manipulation text-offwhite"
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {/* Mobilní menu – vyjede zprava z poza headru */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-20 bg-carbon/80 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 z-30 bottom-0 w-[min(100%,320px)] bg-charcoal border-l border-white/10 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-end h-20 px-6 border-b border-white/10">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex items-center justify-center p-2 -mr-1 text-offwhite"
                  aria-label="Zavřít menu"
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.2em] text-stone mb-2">Kategorie</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="py-3 text-offwhite font-medium hover:text-champagne transition"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link
                    href="#kontakt"
                    onClick={closeMenu}
                    className="rounded-full bg-champagne px-5 py-3 text-carbon text-sm font-semibold shadow-glow transition hover:bg-amber w-full inline-block text-center"
                  >
                    Spolupracovat
                  </Link>
                </div>
                <div className="mt-6 space-y-3">
                  <a
                    href={`mailto:${MOBILE_EMAIL}`}
                    className="flex items-center gap-3 text-sm text-stone hover:text-champagne transition"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0 text-champagne" />
                    {MOBILE_EMAIL}
                  </a>
                  <a
                    href={`tel:+420721369070`}
                    className="flex items-center gap-3 text-sm text-stone hover:text-champagne transition"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0 text-champagne" />
                    {MOBILE_PHONE_1}
                  </a>
                  <a
                    href={`tel:+420725486505`}
                    className="flex items-center gap-3 text-sm text-stone hover:text-champagne transition"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0 text-champagne" />
                    {MOBILE_PHONE_2}
                  </a>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
