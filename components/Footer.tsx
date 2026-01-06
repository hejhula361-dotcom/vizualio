"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const faq = [
  {
    q: "Jaké podklady potřebujete?",
    a: "Stačí půdorys. Když nemáte, napište, jak prostor vypadá, změříme si ho \"virtuálně\"."
  },
  {
    q: "Za jak dlouho to mám hotové?",
    a: "Menší projekty 2–4 dny, větší podle rozsahu."
  },
  {
    q: "Můžu chtít úpravy?",
    a: "Ano. Jedna vlna úprav je vždy zdarma, cílem je vaše spokojenost."
  },
  {
    q: "Jak probíhá komunikace?",
    a: "Online — e-mail / WhatsApp / telefon. Maximum pohodlí, minimum otravování."
  }
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <footer className="border-t border-white/10 bg-charcoal/70 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <Link href="/" className="inline-block">
              <Image src="/img/logo.svg" alt="Vizualio" width={64} height={64} className="h-28 w-28" />
            </Link>
          </div>
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
                  <summary className="cursor-pointer text-xs text-offwhite/80 transition hover:text-offwhite">
                    {item.q}
                  </summary>
                  <p className="mt-1 text-xs text-stone">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Kontakt</p>
            <div className="flex flex-col gap-1 text-offwhite/80">
              <a href="mailto:info@vizualio.cz" className="hover:text-champagne">
                info@vizualio.cz
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
          <p className="text-offwhite font-medium">© 2025 Vizualio</p>
          <p className="text-sm text-stone">3D vizualizace interiérů, exteriérů a nábytku na míru.</p>
        </div>
      </div>
    </footer>
  );
}


