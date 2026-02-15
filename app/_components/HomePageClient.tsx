"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Clock3,
  Ruler,
  TrendingUp,
  Sofa,
  Palette,
  Home,
  Building2,
  Package,
  CheckCircle2,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers,
  Mail,
  Phone,
  Instagram
} from "lucide-react";

import ContactForm from "@/components/ContactForm";
import { PortfolioImage } from "@/components/PortfolioImage";
import { CONTACT_EMAIL } from "@/lib/site";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.12, delayChildren: 0.1 }
};

const benefits = [
  {
    icon: Sparkles,
    title: "Realita, která přesvědčí",
    desc: "Vizualizace jako hotová fotografie — světlo, úhly, materiály i nálada přesně sedí."
  },
  {
    icon: Clock3,
    title: "Rychlé dodání, jasný proces",
    desc: "Pošlete podklady, vytvoříme návrh, doladíme detaily a předáme vizualizaci, která prodává."
  },
  {
    icon: Ruler,
    title: "Perfektní rozměry a přesnost",
    desc: "Každý centimetr odpovídá realitě. Modelujeme ručně podle podkladů."
  },
  {
    icon: TrendingUp,
    title: "Prezentace, která zvyšuje hodnotu",
    desc: "Lepší vizuál = větší zájem. Staging zrychluje prodej až o 40 %."
  }
];

const sluzbyCards = [
  {
    type: "featured",
    title: "Kuchyně",
    desc: "Detailní 3D vizualizace kuchyně – top produkt pro realitky a developery.",
    price: "3 500 Kč",
    priceLabel: "Cena od",
    includes: ["Detailní 3D se všemi prvky", "Přístrojové vybavení + osvětlení", "2 kola úprav zdarma"],
    badge: "Nejprodávanější"
  },
  {
    type: "exterior",
    title: "Rodinný dům (Bungalov)",
    desc: "Jednoduchá architektura, jednopodlažní dům.",
    price: "5 500 Kč",
    priceLabel: "Cena od",
    includes: ["Exteriérová vizualizace", "Jednoduché zahrady"]
  },
  {
    type: "floorplan",
    title: "Balíček 2D+3D",
    desc: "Kompletní řešení – oba výkresy za zvýhodněnou cenu.",
    price: "1 399 Kč",
    oldPrice: "1 499 Kč",
    badge: "Ušetříte 100 Kč"
  }
];

const whyUs = [
  {
    icon: Ruler,
    title: "Přesnost, která rozhoduje",
    desc: "Každý prostor modelujeme podle skutečných rozměrů. Vizualizaci, odpovídá realitě."
  },
  {
    icon: Layers,
    title: "Zvyšuje hodnotu vašeho projektu",
    desc: "Lepší prezentace znamená více zájemců, rychlejší rozhodování a vyšší cenu."
  },
  {
    icon: Zap,
    title: "Rychlá komunikace",
    desc: "Žádné čekání týdny. Efektivní proces, který šetří čas."
  },
  {
    icon: CheckCircle2,
    title: "Flexibilita",
    desc: "Od malého bytu po developerský projekt. Workflow se přizpůsobí."
  }
];

const process = [
  {
    step: "1. Podklady a zadání",
    text: "Pošlete půdorys, rozměry a reference (fotky/materiály). Napište, jestli řešíte stavbu domu, rekonstrukci bytu nebo návrh kuchyně."
  },
  {
    step: "2. Styl, úhly a cena",
    text: "Domluvíme styl 3D vizualizace, úhly kamer, atmosféru a termín. Připravíme rychlý odhad ceny a doporučíme ideální výstupy pro prezentaci."
  },
  {
    step: "3. 3D modelování a fotorealistický render",
    text: "Vytvoříme přesné 3D modelování, nastavíme realistické materiály, světlo a nasvícení. Doladíme detaily tak, aby výsledek působil jako fotografie."
  },
  {
    step: "4. Dodání + úpravy",
    text: "Dodáme finální vizualizace ve vysokém rozlišení pro web, tisk i realitní inzerci. Podle projektu počítáme s koly úprav, aby vše sedělo."
  }
];

const homepagePortfolioItems = [
  { src: "MMDum (1).png", alt: "fotorealistická 3D vizualizace rodinného domu před stavbou" },
  { src: "MMDum (1).jpeg", alt: "3D vizualizace exteriéru domu pro prezentaci developerského projektu" },
  { src: "MMDum (6).jpeg", alt: "3D vizualizace moderní fasády rodinného domu v rámci návrhu stavby" },
  { src: "zastera-jina-varianta.png", alt: "3D vizualizace moderní kuchyně před rekonstrukcí bytu" },
  { src: "vest_skrin_pod_schody.png", alt: "3D návrh vestavěné skříně na míru v interiéru domu" },
  { src: "KV_02.png", alt: "fotorealistická 3D vizualizace interiéru pro realitní kancelář" }
];

const testimonials = [
  {
    name: "Martin, developer",
    quote:
      "Vizualio nám pomohlo prodat byty o měsíce dříve. Atmosféra scén je přesně to, co potřebujeme."
  },
  {
    name: "Tereza, interiérová designérka",
    quote:
      "Skvělá komunikace a preciznost. Úpravy byly rychlé a detaily perfektně sedí na skutečné rozměry."
  },
  {
    name: "Petr, truhlář",
    quote:
      "Vizualizace kuchyně před výrobou ušetřily čas i materiál. Zákazník viděl výsledek dopředu a byl spokojen na první dobrou."
  },
  {
    name: "Jana, realitní makléřka",
    quote:
      "Fotorealistické vizualizace zvyšují zájem o nemovitosti. Klienti si lépe představí výsledek a rozhodují se rychleji."
  },
  {
    name: "David, architekt",
    quote:
      "Přesné 3D modelování a realistické materiály — přesně to, co potřebujeme pro prezentaci projektů investorům."
  }
];

const SEO_TOPICS = [
  {
    icon: Home,
    title: "3D vizualizace pro stavbu domu",
    text: "Před zahájením stavby ověříte proporce, materiály i celkovou atmosféru domu."
  },
  {
    icon: Building2,
    title: "Rekonstrukce bytu bez nejistoty",
    text: "U rekonstrukce bytu ukážeme řešení předem, takže víte, jak bude interiér skutečně působit."
  },
  {
    icon: Sofa,
    title: "Návrh kuchyně krok za krokem",
    text: "Vizualizace kuchyně pomůže sladit ergonomii, úložné prostory, materiály i osvětlení."
  },
  {
    icon: Package,
    title: "Prezentace pro realitní kanceláře",
    text: "Pro realitní kancelář tvoříme vizuály, které zvyšují zájem o nemovitost a urychlují rozhodnutí."
  }
];

export function HomePageClient() {
  return (
    <div className="pb-24">
      <Hero />
      <Services />
      <HomeTopics />
      <WhyUs />
      <Portfolio />
      <Process />
      <Testimonials />
      <Contact />
    </div>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.12]);
  const yBackground = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, -30]);
  const yContent = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 60]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  return (
    <section ref={sectionRef} id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          style={{ scale, y: yBackground }}
          className="absolute inset-0 origin-center"
        >
          <Image
            src="/img/hero_background.png"
            alt="Fotorealistická 3D vizualizace interiéru pro prezentaci projektu"
            fill
            className="object-cover opacity-60"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
      </div>
      <motion.div
        style={{ y: yContent, opacity: opacityContent }}
        className="relative section-container flex min-h-[80vh] flex-col justify-center gap-8"
      >
        <motion.div {...fadeInUp} className="max-w-3xl space-y-5">
          <p className="text-champagne text-sm font-medium uppercase tracking-[0.2em]">Vizualio Studio</p>
          <h1 className="font-semibold leading-tight text-4xl md:text-5xl lg:text-6xl text-offwhite">
            Realita začíná vizualizací
          </h1>
          <p className="text-lg text-stone max-w-2xl">
            Tvoříme 3D vizualizace, které pomáhají při stavbě domu, rekonstrukci interiéru i návrhu kuchyně.
            Každý návrh je připravený tak, aby byl srozumitelný klientům i týmům v realizaci.
          </p>
          <p className="text-stone">
            Spolupracujeme s developery, realitními kancelářemi, architekty, truhláři i soukromými klienty.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <CTAButton href="/#kontakt" primary>
              Nezávazně poptat vizualizaci
            </CTAButton>
            <CTAButton href="/#portfolio">Podívat se na portfolio</CTAButton>
            <CTAButton href="/blog">Číst blog</CTAButton>
          </div>
        </motion.div>
        <motion.div
          {...staggerContainer}
          className="grid gap-4 rounded-2xl border border-white/10 bg-carbon/70 p-5 backdrop-blur-lg md:grid-cols-3"
        >
          {[
            { label: "Dodané vizualizace", value: "40+" },
            {
              label: "Hodnocení",
              value: (
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-offwhite fill-offwhite" />
                  ))}
                </span>
              )
            },
            { label: "Průměrná doba dodání", value: "2–5 dní" }
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-stone text-sm">{stat.label}</p>
              {typeof stat.value === "string" ? (
                <p className="text-3xl font-semibold text-offwhite">{stat.value}</p>
              ) : (
                <div className="text-3xl font-semibold text-offwhite">{stat.value}</div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    setIsMobile(m.matches);
    const handler = () => setIsMobile(m.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const SLUZBY_AUTO_SCROLL_MS = 10000;

function Services() {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardIndexRef = useRef(0);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const el = scrollRef.current;
    const cards = el.querySelectorAll<HTMLElement>("[data-sluzby-card]");
    const count = sluzbyCards.length;
    if (count === 0) return;

    const scrollToCenterCard = (index: number) => {
      const card = cards[index];
      if (!card) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const viewCenter = el.clientWidth / 2;
      const targetScroll = Math.max(0, Math.min(maxScroll, cardCenter - viewCenter));
      el.scrollTo({ left: targetScroll, behavior: "smooth" });
    };

    const step = () => {
      cardIndexRef.current = (cardIndexRef.current + 1) % count;
      scrollToCenterCard(cardIndexRef.current);
    };

    const id = setInterval(step, SLUZBY_AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [isMobile]);

  const containerClassName =
    "mt-10 flex overflow-x-auto gap-6 py-8 px-6 -mx-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:py-0 scrollbar-hide";
  const cardClassName = (item: (typeof sluzbyCards)[0]) =>
    `card-hover relative flex-shrink-0 w-[min(72vw,280px)] rounded-2xl border p-8 transition duration-300 md:w-auto md:flex-shrink md:min-w-0 mt-5 mb-10 md:mt-0 md:mb-0 ${
      item.type === "featured"
        ? "border-2 border-champagne bg-charcoal/80 shadow-glow"
        : "border-white/10 bg-charcoal/50"
    }`;

  return (
    <section id="sluzby" className="section-container">
      <motion.div {...fadeInUp} className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Služby, které nabízíme</h2>
          <p className="section-subtitle max-w-2xl">
            Profesionální vizualizace pro realitky, developery a interiéry
          </p>
        </div>
      </motion.div>
      {isMobile ? (
        <div ref={scrollRef} className={containerClassName}>
          {sluzbyCards.map((item) => (
            <div key={item.title} data-sluzby-card className={cardClassName(item)}>
              {item.badge && (
                <div
                  className={
                    item.type === "floorplan"
                      ? "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-champagne px-5 py-1 text-xs font-bold uppercase text-carbon whitespace-nowrap min-w-[140px] text-center"
                      : "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase text-carbon"
                  }
                >
                  {item.type !== "floorplan" && <Star className="h-3 w-3" />}
                  {item.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-offwhite mb-4">{item.title}</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">{item.desc}</p>
              <div className="rounded-xl bg-white/5 p-5 mb-6 border-l-4 border-champagne">
                {item.priceLabel && (
                  <p className="text-stone text-xs font-medium uppercase tracking-wide mb-1">
                    {item.priceLabel}
                  </p>
                )}
                <p className="text-3xl font-bold text-champagne">{item.price}</p>
                {item.oldPrice && (
                  <p className="text-stone text-xs line-through mt-1">{item.oldPrice}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          ref={scrollRef}
          {...staggerContainer}
          className={containerClassName}
        >
          {sluzbyCards.map((item) => (
            <motion.div
              key={item.title}
              data-sluzby-card
              {...fadeInUp}
              className={cardClassName(item)}
            >
              {item.badge && (
                <div
                  className={
                    item.type === "floorplan"
                      ? "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-champagne px-5 py-1 text-xs font-bold uppercase text-carbon whitespace-nowrap min-w-[140px] text-center"
                      : "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase text-carbon"
                  }
                >
                  {item.type !== "floorplan" && <Star className="h-3 w-3" />}
                  {item.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-offwhite mb-4">{item.title}</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">{item.desc}</p>
              <div className="rounded-xl bg-white/5 p-5 mb-6 border-l-4 border-champagne">
                {item.priceLabel && (
                  <p className="text-stone text-xs font-medium uppercase tracking-wide mb-1">
                    {item.priceLabel}
                  </p>
                )}
                <p className="text-3xl font-bold text-champagne">{item.price}</p>
                {item.oldPrice && (
                  <p className="text-stone text-xs line-through mt-1">{item.oldPrice}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <motion.div {...fadeInUp} className="mt-10 flex items-center justify-center gap-4 max-w-2xl mx-auto">
        <div className="flex-1 flex items-center justify-end gap-0 min-w-0">
          <div className="h-px flex-1 max-w-[80px] bg-champagne/50" />
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-champagne/70" />
        </div>
        <Link
          href="/cenik"
          className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber flex-shrink-0"
        >
          Všechny služby a ceník
        </Link>
        <div className="flex-1 flex items-center justify-start gap-0 min-w-0">
          <ChevronLeft className="h-5 w-5 flex-shrink-0 text-champagne/70" />
          <div className="h-px flex-1 max-w-[80px] bg-champagne/50" />
        </div>
      </motion.div>
    </section>
  );
}

function HomeTopics() {
  return (
    <section className="section-container pt-0 md:pt-4">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Kde vám 3D vizualizace nejvíc pomůže</h2>
      </motion.div>
      <motion.div {...staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SEO_TOPICS.map((topic) => (
          <motion.div key={topic.title} {...fadeInUp} className="card h-full">
            <topic.icon className="h-6 w-6 text-champagne" />
            <h3 className="mt-3 text-base font-semibold text-offwhite">{topic.title}</h3>
            <p className="mt-2 text-sm text-stone">{topic.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="proc" className="section-container pt-1.5 pb-0 md:pt-1.5">
      <motion.div {...fadeInUp} className="max-w-6xl">
        <h2 className="section-title">Proč Vizualio</h2>
        <p className="section-subtitle max-w-none">
          Stojíme na přesném modelování, realistických materiálech a individuálním přístupu. Díky tomu vidíte
          vizualizaci ještě před zahájením stavby nebo rekonstrukce a můžete rozhodovat bez nejistoty.
        </p>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {whyUs.map((item, index) => (
          <motion.div
            key={item.title}
            {...fadeInUp}
            className={`card card-hover h-full flex flex-row items-center gap-3 md:flex-col md:items-stretch md:gap-0 ${index === 3 ? "hidden md:flex" : ""}`}
          >
            <item.icon className="h-6 w-6 md:h-8 md:w-8 text-champagne flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold md:mt-4 md:text-lg">{item.title}</h3>
              <p className="mt-0.5 text-xs text-stone md:mt-2 md:text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Process() {
  return (
    <section id="proces" className="section-container pt-0 hidden md:block">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Jak probíhá 3D vizualizace</h2>
        <p className="section-subtitle">
          Od podkladů po fotorealistický render — pro stavbu domu, rekonstrukci bytu i návrh kuchyně.
        </p>
      </motion.div>
      <div className="mt-10 grid gap-6 md:grid-cols-[320px,1fr]">
        <motion.div
          {...fadeInUp}
          className="card"
        >
          <p className="text-stone text-sm">Shrnutí procesu</p>
          <h3 className="mt-2 text-2xl font-semibold text-offwhite">Od podkladů k fotorealistickému renderu</h3>
          <p className="mt-3 text-sm text-stone">
            Ať řešíte stavbu domu, rekonstrukci bytu nebo prezentaci nemovitosti pro realitní kancelář, postup je
            vždy stejný: sladíme zadání, připravíme přesné 3D modelování, nastavíme realistické materiály a světlo a
            dodáme hotové vizualizace připravené pro web, tisk i marketing.
          </p>
          <Link href="/#kontakt" className="mt-4 inline-flex items-center gap-2 text-champagne hover:text-amber">
            Poptat 3D vizualizaci <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          {...staggerContainer}
          className="space-y-4"
        >
          {process.map((item, idx) => (
            <motion.div
              key={item.step}
              {...fadeInUp}
              className="card flex gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 bg-charcoal text-champagne">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-offwhite">{item.step}</h4>
                <p className="mt-2 text-sm text-stone">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="section-container pt-6 md:pt-6">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Prostor, který mluví za vás.</h2>
        <p className="section-subtitle">
          Každý projekt je jiný, ale společný mají jeden cíl — přesvědčit na první pohled.
        </p>
        <p className="mt-3 text-sm text-stone">
          Ukázky 3D vizualizací rodinných domů, kuchyní, rekonstrukcí i projektů pro realitní kanceláře.
        </p>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {homepagePortfolioItems.map((item, i) => {
          const isHiddenOnMobile = i >= 4;
          const isWideOnMobile = i === 0 || i === 3;
          const isSquareOnMobile = i === 1 || i === 2;
          const isFifthImage = i === 4;
          return (
            <motion.div
              key={item.src}
              {...fadeInUp}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal/60 ${
                isHiddenOnMobile ? "hidden sm:block" : ""
              } ${isWideOnMobile ? "col-span-2" : ""} ${isFifthImage ? "sm:col-span-2" : ""}`}
            >
              <div
                className={`relative w-full ${
                  isWideOnMobile ? "aspect-video sm:aspect-auto sm:h-64" : ""
                } ${isSquareOnMobile ? "aspect-square sm:aspect-auto sm:h-64" : ""} ${
                  isFifthImage ? "sm:aspect-auto sm:h-64" : isHiddenOnMobile ? "sm:h-64" : ""
                }`}
              >
                <PortfolioImage
                  src={item.src}
                  alt={item.alt}
                  priority={i < 3}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105 z-10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div {...fadeInUp} className="mt-10 flex flex-col items-center gap-4">
        <p className="text-stone text-sm">Podívejte se na další vizualizace</p>
        <div className="flex items-center justify-center gap-4 max-w-2xl w-full">
          <div className="flex-1 flex items-center justify-end gap-0 min-w-0">
            <div className="h-px flex-1 max-w-[80px] bg-champagne/50" />
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-champagne/70" />
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber flex-shrink-0"
          >
            Portfolio
          </Link>
          <div className="flex-1 flex items-center justify-start gap-0 min-w-0">
            <ChevronLeft className="h-5 w-5 flex-shrink-0 text-champagne/70" />
            <div className="h-px flex-1 max-w-[80px] bg-champagne/50" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function TestimonialCard({ item, className = "" }: { item: (typeof testimonials)[0]; className?: string }) {
  return (
    <div className={`card h-full flex-shrink-0 ${className}`}>
      <Quote className="h-6 w-6 text-champagne" />
      <p className="mt-4 text-sm text-offwhite/90">{item.quote}</p>
      <p className="mt-4 text-sm font-semibold text-offwhite">{item.name}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section id="reference" className="section-container pt-0">
      <motion.div {...fadeInUp} className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Co říkají klienti</h2>
          <p className="section-subtitle">Reference, které potvrzují kvalitu i rychlost.</p>
        </div>
        <Star className="h-8 w-8 text-champagne hidden md:block" />
      </motion.div>
      <div className="mt-10 -mx-6 overflow-hidden md:-mx-6 relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-carbon to-transparent z-10 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-carbon to-transparent z-10 pointer-events-none"
          aria-hidden
        />
        <div className="flex testimonials-marquee-inner w-max gap-6 px-6">
          {[...testimonials, ...testimonials].map((item, i) => (
            <TestimonialCard
              key={`${item.name}-${i}`}
              item={item}
              className="w-[min(85vw,320px)] md:w-[340px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="kontakt" className="section-container">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Napište nám, co máte v hlavě.</h2>
        <p className="section-subtitle">
          Klidně i nesmysl. My z toho smysl uděláme. Stačí pár vět a my připravíme cestu k vizualizaci.
        </p>
        <p className="mt-3 text-sm text-stone">
          Chystáte stavbu domu, rekonstrukci bytu nebo potřebujete profesionální prezentaci nemovitosti? Ozvěte se.
        </p>
      </motion.div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,420px]">
        <motion.div
          {...fadeInUp}
          className="card"
        >
          <h3 className="text-xl font-semibold text-offwhite">Co máte na mysli?</h3>
          <p className="mt-2 text-sm text-stone">
            Stačí pár vět. My už víme, jak z toho udělat vizualizaci, která dává smysl.
          </p>
          <ContactForm />
        </motion.div>
        <div className="flex h-full min-h-0 max-w-md flex-col gap-6 mx-auto w-full lg:max-w-none lg:mx-0">
          <motion.div {...fadeInUp} className="card flex flex-1 flex-col min-h-0 justify-center pt-8 px-8 pb-12 md:justify-start md:pb-8">
            <h4 className="text-lg font-semibold text-offwhite">Co se stane po odeslání?</h4>
            <ul className="mt-4 space-y-3 text-sm text-stone">
              <li>• Ozveme se do 24 hodin.</li>
              <li>• Domluvíme styl, úhly a termíny.</li>
              <li>• Připravíme rychlý odhad ceny.</li>
              <li>• Dodáme vizualizaci, která vám vyrazí dech.</li>
            </ul>
          </motion.div>
          <motion.div {...fadeInUp} className="card flex flex-1 flex-col min-h-0 p-8">
            <h4 className="text-lg font-semibold text-offwhite">Kontakt</h4>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3 text-sm text-offwhite/90 flex-1 min-w-0">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2 transition hover:text-champagne"
                >
                  <Mail className="h-4 w-4 text-champagne flex-shrink-0" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href="tel:+420721369070"
                  className="flex items-center gap-2 transition hover:text-champagne"
                >
                  <Phone className="h-4 w-4 text-champagne flex-shrink-0" />
                  721 369 070
                </a>
                <a
                  href="tel:+420725486505"
                  className="flex items-center gap-2 transition hover:text-champagne"
                >
                  <Phone className="h-4 w-4 text-champagne flex-shrink-0" />
                  725 486 505
                </a>
              </div>
              <a
                href="https://www.instagram.com/vizualio.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 transition hover:text-champagne text-offwhite/90 mr-4"
              >
                <Instagram className="h-14 w-14 text-champagne" />
                <span className="text-sm">@vizualio.cz</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTAButton({
  href,
  children,
  primary = false
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, boxShadow: primary ? "0 0 24px rgba(198, 166, 124, 0.35)" : "" }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
        primary
          ? "bg-champagne text-carbon shadow-glow hover:bg-amber"
          : "border border-white/20 text-offwhite hover:border-champagne hover:text-champagne"
      }`}
    >
      {children}
    </motion.a>
  );
}
