"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { useSectionColor } from "@/app/context/SectionColorContext";
import { CONTACT_EMAIL } from "@/lib/site";

const faq: { q: string; a: string | string[] }[] = [
  {
    q: "Kolik času trvá složitý projekt?",
    a: "5–10 pracovních dní pro vily, paláce a velké developerské projekty."
  },
  {
    q: "Je možné expres dodání?",
    a: "Ano! +1 000 Kč za 24h (standardní projekty). U složitějších zakázek individuálně."
  },
  {
    q: "Co potřebujete pro zahájení?",
    a: "Půdorys, rozměry, reference (foto/materiály). Čím více podkladů, tím přesnější výsledek."
  },
  {
    q: "Kolik kol úprav?",
    a: [
      "Standard: 2 kola zdarma",
      "Komplexní: 1–2 kola zdarma",
      "Větší projekty: individuálně"
    ]
  }
];

export default function Footer() {
  const pathname = usePathname();
  const { displayColor } = useSectionColor();
  const isOnCenik = pathname === "/cenik";
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isAccount = pathname?.startsWith("/account") ?? false;
  const isAuth = pathname === "/login" || pathname === "/admin/login";
  const isPortal = isAdmin || isAccount || isAuth;

  if (isPortal) {
    return (
      <footer className="border-t border-white/10 bg-charcoal/70 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-6">
            <p className="text-offwhite font-medium">© 2026 Vizualio</p>
            <p className="text-sm text-stone">3D vizualizace interiérů, exteriérů a nábytku na míru.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-charcoal/70 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className={`grid gap-8 mb-8 ${isOnCenik ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          <div>
            <Link href="/" className="inline-block" aria-label="Vizualio – úvod">
              <span
                className="logo-gold h-28 w-28 inline-block transition-colors duration-300"
                style={isOnCenik ? { backgroundColor: displayColor } : undefined}
                role="img"
                aria-hidden="true"
              />
            </Link>
          </div>
          {!isOnCenik && (
          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">FAQ</p>
            <div className="space-y-1">
              {faq.map((item, idx) => (
                <details
                  key={item.q}
                  className="group"
                  open={openIndex === idx}
                  onToggle={(e) => setOpenIndex(e.currentTarget.open ? idx : null)}
                >
                  <summary className="cursor-pointer text-xs text-offwhite/80 transition hover:text-offwhite flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-champagne/80" />
                    {item.q}
                  </summary>
                  <div className="mt-1 ml-5 text-xs text-stone">
                    {Array.isArray(item.a) ? (
                      <ul className="space-y-1">
                        {item.a.map((line) => (
                          <li key={line} className="flex items-center gap-2">
                            <span className="text-champagne">✓</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{item.a}</p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
          )}
          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Kontakt</p>
            <div className="flex flex-col gap-1 text-offwhite/80">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-champagne">
                {CONTACT_EMAIL}
              </a>
              <a href="tel:+420721369070" className="hover:text-champagne">
                +420 721369070
              </a>
              <a
                href="https://www.instagram.com/vizualio.cz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-champagne"
              >
                Sledujte nás na Instagramu
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-6 border-t border-white/10">
          <p className="text-offwhite font-medium">© 2026 Vizualio</p>
          <p className="text-sm text-stone">3D vizualizace interiérů, exteriérů a nábytku na míru.</p>
        </div>
      </div>
    </footer>
  );
}


