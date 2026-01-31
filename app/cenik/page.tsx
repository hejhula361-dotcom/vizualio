"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Clock, Star, ImageIcon } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.08, delayChildren: 0.05 }
};

const interiorPricing = [
  {
    title: "Samostatná koupelna / WC",
    desc: "Profesionální vizualizace koupelny s detailním vybavením a nasvítěním.",
    price: "2 500 Kč",
    priceLabel: "Cena od",
    includes: ["2D + 3D vizualizace", "2 perspektivy / pohledy", "2 kola úprav zdarma"],
    featured: false
  },
  {
    title: "Ložnice / Dětský pokoj",
    desc: "Útulná vizualizace ložnice nebo dětského pokoje se standardním vybavením.",
    price: "3 000 Kč",
    priceLabel: "Cena od",
    includes: ["Standardní výbava pokoje", "2–3 finální pohledy", "2 kola úprav zdarma"],
    featured: false
  },
  {
    title: "Kuchyně",
    desc: "Detailní 3D vizualizace kuchyně – top produkt pro realitky a developery.",
    price: "3 500 Kč",
    priceLabel: "Cena od",
    includes: ["Detailní 3D se všemi prvky", "Přístrojové vybavení + osvětlení", "2 kola úprav zdarma"],
    featured: true,
    badge: "Nejprodávanější"
  },
  {
    title: "Obývák + Kuchyně",
    desc: "Kompletní prostorová vizualizace velkého společenského prostoru.",
    price: "6 000 Kč",
    priceLabel: "Cena od",
    includes: ["Celodenní prostorové řešení", "Kompletní vizualizace", "2 kola úprav zdarma"],
    featured: false
  },
  {
    title: "Celý byt (2kk/3kk)",
    desc: "Úplná vizualizace bytu – perfektní pro developerské projekty.",
    price: "Individuálně",
    priceLabel: "Cena",
    priceSub: "Konzultace zdarma",
    includes: ["Kompletní vizualizace bytu", "Ideální pro developery", "Cena dle komplexnosti"],
    featured: false
  },
  {
    title: "Stylizovaná vizualizace",
    desc: "Unikátní umělecké zpracování vizualizace v různých stylech.",
    price: "4 500 Kč",
    priceLabel: "Cena od",
    includes: ["Water Color (akvarel)", "Sketch (náčrtový)", "Painting (olejomalba)", "Color Block (ploché barvy)"],
    featured: false,
    badge: "Novinka"
  }
];

const exteriorPricing = [
  {
    title: "Rodinný dům (Bungalov)",
    desc: "Jednoduchá architektura, jednopodlažní dům.",
    price: "5 500 Kč",
    priceLabel: "Cena od",
    includes: ["Exteriérová vizualizace", "Jednoduché zahrady"]
  },
  {
    title: "Rodinný dům (2 patra)",
    desc: "Komplexnější fasáda, dvoupodlažní dům.",
    price: "7 000 Kč",
    priceLabel: "Cena od",
    includes: ["Detailní exteriér", "Komplexní fasáda"]
  },
  {
    title: "Bytový dům / Developer",
    desc: "Projekt s krajinou a detaily pro větší developerské projekty.",
    price: "12 000 Kč",
    priceLabel: "Cena od",
    priceSub: "Dle rozsahu projektu",
    includes: ["Projekt s krajinou", "Detailní zpracování"]
  }
];

const floorplanPricing = [
  { title: "2D Půdorys", desc: "Technický výkres – čistý, přehledný půdorys pro inzeráty.", price: "500 Kč" },
  { title: "3D Půdorys do 80 m²", desc: "Prostorový 3D pohled s nábytkem a materiály.", price: "999 Kč" },
  { title: "3D Půdorys 80–150 m²", desc: "Prostorový 3D pohled pro větší byty a domy.", price: "1 299 Kč" },
  {
    title: "Balíček 2D+3D",
    desc: "Kompletní řešení – oba výkresy za zvýhodněnou cenu.",
    price: "1 399 Kč",
    oldPrice: "1 499 Kč",
    badge: "Ušetříte 100 Kč"
  }
];

const extraServices = [
  { title: "Dodatečné kolo úprav", desc: "Další úpravy nad rámec 2 kol zdarma", price: "+500 Kč" },
  { title: "Dodatečná perspektiva", desc: "Další pohled / úhel vizualizace", price: "+400 Kč" },
  { title: "Expresní dodávka (1 den)", desc: "Dle náročnosti projektu, pro běžné zakázky", price: "od +1 000 Kč" }
];

export default function CenikPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="section-container pt-12 pb-6 md:pt-12 md:pb-6">
        <motion.div {...fadeInUp} className="text-center">
          <h1 className="section-title">Ceník 3D Vizualizací</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Profesionální vizualizace pro realitky, developery a interiéry
          </p>
          <div className="w-[148px] h-0.5 bg-champagne/60 mx-auto my-8" />
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-2">
            <Clock className="h-4 w-4 text-champagne" />
            <span className="text-sm text-champagne font-medium">Doba dodání: 2–5 pracovních dní</span>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
          >
            <ImageIcon className="h-4 w-4" />
            Naše portfolio
          </Link>
        </motion.div>
      </section>

      {/* Vizualizace Interiéru */}
      <section className="section-container !pt-0 pb-0">
        <motion.div {...fadeInUp} className="mb-10">
          <h2 className="section-title pl-6 border-l-4 border-champagne">Vizualizace Interiéru</h2>
        </motion.div>
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interiorPricing.map((item) => (
            <motion.div
              key={item.title}
              {...fadeInUp}
              className={`card-hover relative rounded-2xl border p-8 transition duration-300 ${
                item.featured
                  ? "border-2 border-champagne bg-charcoal/80 shadow-glow"
                  : "border-white/10 bg-charcoal/50"
              }`}
            >
              {item.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase text-carbon">
                  <Star className="h-3 w-3" />
                  {item.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-offwhite mb-4">{item.title}</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">{item.desc}</p>
              <div
                className={`rounded-xl p-5 mb-6 border-l-4 border-champagne ${
                  item.featured ? "bg-champagne/10" : "bg-white/5"
                }`}
              >
                <p className="text-stone text-xs font-medium uppercase tracking-wide mb-1">
                  {item.priceLabel}
                </p>
                <p className="text-3xl font-bold text-champagne">{item.price}</p>
                {item.priceSub && (
                  <p className="text-xs text-champagne/90 mt-2">{item.priceSub}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-stone text-xs font-medium uppercase tracking-wide mb-3">Zahrnuje</p>
                <ul className="space-y-2 text-sm">
                  {item.includes.map((inc) => (
                    <li key={inc} className="flex items-center gap-3 text-stone">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-champagne" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Vizualizace Exteriéru */}
      <section className="section-container">
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="section-title pl-6 border-l-4 border-champagne">Vizualizace Exteriéru</h2>
          <Link
            href="/#kontakt"
            className="rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
          >
            Kontaktujte nás
          </Link>
        </motion.div>
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exteriorPricing.map((item) => (
            <motion.div
              key={item.title}
              {...fadeInUp}
              className="card-hover rounded-2xl border border-white/10 bg-charcoal/50 p-8 transition duration-300"
            >
              <h3 className="text-xl font-semibold text-offwhite mb-4">{item.title}</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">{item.desc}</p>
              <div className="rounded-xl bg-white/5 p-5 mb-6 border-l-4 border-champagne">
                <p className="text-stone text-xs font-medium uppercase tracking-wide mb-1">
                  {item.priceLabel}
                </p>
                <p className="text-3xl font-bold text-champagne">{item.price}</p>
                {item.priceSub && (
                  <p className="text-xs text-champagne/90 mt-2">{item.priceSub}</p>
                )}
              </div>
              <ul className="space-y-2 text-sm">
                {item.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-3 text-stone">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-champagne" />
                    {inc}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Půdorysy 2D/3D */}
      <section className="section-container">
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="section-title pl-6 border-l-4 border-champagne">Půdorysy 2D/3D</h2>
          <Link
            href="/#kontakt"
            className="rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
          >
            Kontaktujte nás
          </Link>
        </motion.div>
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {floorplanPricing.map((item) => (
            <motion.div
              key={item.title}
              {...fadeInUp}
              className={`card-hover relative rounded-2xl border p-8 transition duration-300 ${
                item.badge
                  ? "border-2 border-champagne/50"
                  : "border-white/10 bg-charcoal/50"
              }`}
            >
              {item.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-champagne px-5 py-1 text-xs font-bold uppercase text-carbon whitespace-nowrap min-w-[140px] text-center">
                  {item.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-offwhite mb-4">{item.title}</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">{item.desc}</p>
              <div
                className={`rounded-xl border-l-4 border-champagne p-5 ${
                  item.oldPrice ? "bg-champagne/10" : "bg-white/5"
                }`}
              >
                <p className="text-3xl font-bold text-champagne">{item.price}</p>
                {item.oldPrice && (
                  <p className="text-stone text-xs line-through mt-1">{item.oldPrice}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Dodatečné služby */}
      <section className="section-container">
        <motion.h2 {...fadeInUp} className="section-title pl-6 border-l-4 border-champagne mb-10">
          Dodatečné služby
        </motion.h2>
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {extraServices.map((item) => (
            <motion.div
              key={item.title}
              {...fadeInUp}
              className="card-hover rounded-2xl border border-white/10 bg-charcoal/50 p-6 flex items-center justify-between gap-4 transition duration-300"
            >
              <div>
                <h3 className="text-lg font-semibold text-offwhite mb-2">{item.title}</h3>
                <p className="text-stone text-sm">{item.desc}</p>
              </div>
              <p className="text-2xl font-bold text-champagne whitespace-nowrap">{item.price}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Nábytek na míru */}
      <section className="section-container">
        <motion.h2 {...fadeInUp} className="section-title pl-6 border-l-4 border-champagne mb-10">
          Nábytek na míru + Výroba
        </motion.h2>
        <motion.div {...fadeInUp} className="rounded-2xl border border-white/10 bg-charcoal/50 p-8">
          <p className="text-stone text-center mb-8">
            Kompletní služba od naměření po montáž – spolupráce s českým truhlářem
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: 1, title: "Naměření", sub: "truhlář přijede" },
              { num: 2, title: "3D návrh", sub: "vizualizace" },
              { num: 3, title: "Výroba", sub: "dle vizualizace" },
              { num: 4, title: "Montáž", sub: "u vás doma" }
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-center transition hover:border-champagne/30"
              >
                <div className="w-10 h-10 rounded-lg bg-champagne text-carbon font-bold flex items-center justify-center mx-auto mb-3 text-lg">
                  {step.num}
                </div>
                <p className="text-offwhite font-semibold text-sm mb-1">{step.title}</p>
                <p className="text-stone text-xs">{step.sub}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-champagne/20 bg-white/5 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-offwhite font-medium mb-2">
                  Rychlejší komunikace díky vizualizacím
                </p>
                <ul className="text-stone text-sm space-y-1">
                  {[
                    "Zvýhodněné ceny pro kompletní zakázky",
                    "Spolupráce s českým truhlářem",
                    "Naměření zdarma v rámci zakázky",
                    "Realizace po celé ČR i zahraničí"
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-champagne flex-shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/#kontakt"
                className="rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber whitespace-nowrap inline-flex items-center justify-center"
              >
                Objednat naměření
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA footer */}
      <section className="section-container border-t border-white/10 pt-16">
        <motion.div {...fadeInUp} className="text-center">
          <h2 className="text-2xl font-semibold text-offwhite mb-4">Máte dotaz?</h2>
          <p className="text-stone mb-8 max-w-md mx-auto">
            Rádi vám připravíme individuální nabídku podle vašeho zadání. Konzultace je zdarma.
          </p>
          <Link
            href="/#kontakt"
            className="inline-block rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
          >
            Nezávazně poptat
          </Link>
          <p className="text-stone text-xs mt-8">
            Ceník platný od ledna 2026 | Ceny bez DPH | Rezervujeme si právo na změny
          </p>
        </motion.div>
      </section>
    </div>
  );
}
