"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  ChevronRight,
  Shield,
  Zap,
  Layers,
  Mail
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

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

const services = [
  {
    icon: Sofa,
    title: "Fotorealistické interiéry",
    desc: "Kompozice, materiály, světlo — vizualizace k nerozeznání od reálné fotografie."
  },
  {
    icon: Palette,
    title: "Kuchyně a nábytek na míru",
    desc: "Modelujeme ve správných rozměrech, aby klient přesně chápal funkci v prostoru."
  },
  {
    icon: Home,
    title: "Virtuální homestaging",
    desc: "Prázdný byt zaplníme stylem a atmosférou. Vizuál, který prodává bez stěhování."
  },
  {
    icon: Building2,
    title: "Exteriéry a developerské projekty",
    desc: "Atmosféra, světlo v různých dobách, detaily, které zaujmou investory."
  },
  {
    icon: Package,
    title: "3D produktové renderování",
    desc: "Luxusně čisté rendery nábytku, světel či doplňků pro web, katalog i reklamu."
  }
];

const whyUs = [
  {
    icon: Shield,
    title: "Přesnost, která rozhoduje",
    desc: "Každý model je v měřítku. Co vidíte, to můžete postavit."
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
    step: "1. Zadání",
    text: "Pošlete půdorys, fotky, moodboard nebo jen popis myšlenky. Stačí i „mám nápad v hlavě“."
  },
  {
    step: "2. Návrh a domluva detailů",
    text: "Upřesníme styl, úhly, světla a atmosféru. Sdělíme orientační cenu a termín."
  },
  {
    step: "3. Tvorba vizualizace",
    text: "Modelujeme 3D prostor, nasvítíme scénu, doladíme detaily. Můžete vyžádat drobné úpravy."
  },
  {
    step: "4. Dodání finálních výstupů",
    text: "Dostanete kvalitní render připravený pro prezentaci, web nebo tisk."
  }
];

const portfolio = [
  "/img/viz1.png",
  "/img/viz2.png",
  "/img/viz3.png",
  "/img/viz4.png",
  "/img/viz5.png",
  "/img/viz6.png"
];

const testimonials = [
  {
    name: "Lucie, architektka",
    quote:
      "Výstupy působí jako fotografie. Klienti rychleji schvalují návrhy a celý proces se zrychlil."
  },
  {
    name: "Martin, developer",
    quote:
      "Vizualio nám pomohlo prodat byty o měsíce dříve. Atmosféra scén je přesně to, co potřebujeme."
  },
  {
    name: "Tereza, interiérová designérka",
    quote:
      "Skvělá komunikace a preciznost. Úpravy byly rychlé a detaily perfektně sedí na skutečné rozměry."
  }
];

const pricing = [
  {
    name: "Bytová scéna / místnost",
    price: "od 2 500 Kč",
    desc: "Jedna vizualizace místnosti, vhodná pro prezentaci návrhu.",
    accent: false
  },
  {
    name: "Byt do 50 m²",
    price: "od 3 900 Kč",
    desc: "Více úhlů, ideální pro realitky a pronajímatele.",
    accent: true
  },
  {
    name: "Kuchyně / nábytek na míru",
    price: "od 2 900 Kč",
    desc: "Perfektní pro truhláře. Přesné rozměry a detaily.",
    accent: false
  },
  {
    name: "Developerské projekty",
    price: "Individuálně",
    desc: "Cena dle rozsahu, úhlů a detailnosti. Připravíme nabídku na míru.",
    accent: false
  }
];

const faq = [
  {
    q: "Jaké podklady potřebujete?",
    a: "Stačí půdorys. Když nemáte, napište, jak prostor vypadá, změříme si ho „virtuálně“."
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

export default function Page() {
  return (
    <div className="pb-24">
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <Contact />
    </div>
  );
}

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = Math.max(1.2 - scrollY * 0.0005, 1);
  const translateY = Math.min(scrollY * 0.3, 200);

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            willChange: "transform"
          }}
          className="absolute inset-0"
        >
          <Image
            src="/img/hero_background.png"
            alt="Hero background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon dark:from-black/60 dark:to-carbon from-white/40 to-light-bg" />
      </div>
      <div className="relative section-container flex min-h-[80vh] flex-col justify-center gap-8">
        <motion.div {...fadeInUp} className="max-w-3xl space-y-5">
          <p className="text-champagne text-sm uppercase tracking-[0.2em] dark:text-champagne text-light-accent">Vizualio Studio</p>
          <h1 className="font-semibold leading-tight text-4xl md:text-5xl lg:text-6xl text-offwhite dark:text-offwhite text-light-text">
            Proměníme váš nápad v prostor, který prodává.
          </h1>
          <p className="text-lg text-stone max-w-2xl dark:text-stone text-light-text-secondary">
            Fotorealistické 3D vizualizace interiérů, exteriérů i nábytku na míru. Uvidíte svůj
            projekt ještě před realizací — vy i vaši klienti.
          </p>
          <p className="text-stone dark:text-stone text-light-text-secondary">
            Pro developery, realitní kanceláře, architekty, truhláře i soukromé klienty.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <CTAButton href="#kontakt" primary>
              Nezávazně poptat vizualizaci
            </CTAButton>
            <CTAButton href="#portfolio">Podívat se na portfolio</CTAButton>
          </div>
        </motion.div>
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-charcoal/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-charcoal/80 border-light-border bg-light-card sm:grid-cols-3"
        >
          {[
            { label: "Preciznost", value: "Modely v měřítku" },
            { label: "Cena", value: "Zvyšuje hodnotu vašeho projektu" },
            { label: "Rychlost", value: "2–4 dny menší projekty" }
          ].map((item) => (
            <motion.div key={item.label} {...fadeInUp} className="space-y-2">
              <p className="text-stone text-sm dark:text-stone text-light-text-secondary">{item.label}</p>
              <p className="text-offwhite font-semibold dark:text-offwhite text-light-text">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


function Services() {
  return (
    <section id="sluzby" className="section-container">
      <motion.div {...fadeInUp} className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Služby, které prodávají</h2>
          <p className="section-subtitle max-w-2xl">
            Od interiérů po produkty. Každá vizualizace má jeden cíl — přesvědčit na první pohled.
          </p>
        </div>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            {...fadeInUp}
            className="card card-hover h-full"
          >
            <service.icon className="h-9 w-9 text-champagne" />
            <h3 className="mt-4 text-xl font-semibold text-offwhite">{service.title}</h3>
            <p className="mt-3 text-sm text-stone">{service.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="proc" className="section-container">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Proč Vizualio</h2>
        <p className="section-subtitle">
          Přesnost, filmová atmosféra, rychlá komunikace. Workflow, které se přizpůsobí vašemu projektu.
        </p>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {whyUs.map((item) => (
          <motion.div
            key={item.title}
            {...fadeInUp}
            className="card card-hover h-full"
          >
            <item.icon className="h-8 w-8 text-champagne" />
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-stone">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        {...fadeInUp}
        className="mt-12 grid gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-charcoal/90 to-obsidian/80 p-8 backdrop-blur-lg md:grid-cols-3"
      >
        {[
          { label: "Dodané vizualizace", value: "1200+" },
          { label: "Průměrná úspora času", value: "40 %" },
          { label: "Průměrná doba dodání", value: "3 dny" }
        ].map((stat) => (
          <div key={stat.label} className="space-y-2">
            <p className="text-stone text-sm">{stat.label}</p>
            <p className="text-3xl font-semibold text-offwhite">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function Process() {
  return (
    <section id="proces" className="section-container">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Proces spolupráce</h2>
        <p className="section-subtitle">Jasné kroky od nápadu po finální vizualizaci.</p>
      </motion.div>
      <div className="mt-10 grid gap-6 md:grid-cols-[320px,1fr]">
        <motion.div
          {...fadeInUp}
          className="card"
        >
          <p className="text-stone text-sm">Shrnutí</p>
          <h3 className="mt-2 text-2xl font-semibold text-offwhite">Od myšlenky k renderu</h3>
          <p className="mt-3 text-sm text-stone">
            Stačí nápad nebo půdorys. Doladíme styl, nasvítíme scénu a dodáme vizualizaci připravenou
            k prezentaci i tisku.
          </p>
          <Link href="#kontakt" className="mt-4 inline-flex items-center gap-2 text-champagne hover:text-amber">
            Spolupracovat <ChevronRight className="h-4 w-4" />
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
    <section id="portfolio" className="section-container">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Prostor, který mluví za vás.</h2>
        <p className="section-subtitle">
          Každý projekt je jiný, ale společný mají jeden cíl — přesvědčit na první pohled.
        </p>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {portfolio.map((src, i) => (
          <motion.div
            key={src}
            {...fadeInUp}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal/60"
          >
            <div className="relative h-64 w-full">
              <Image src={src} alt={`Portfolio ${i + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="reference" className="section-container">
      <motion.div {...fadeInUp} className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Co říkají klienti</h2>
          <p className="section-subtitle">Reference, které potvrzují kvalitu i rychlost.</p>
        </div>
        <Star className="h-8 w-8 text-champagne hidden md:block" />
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {testimonials.map((item) => (
          <motion.div
            key={item.name}
            {...fadeInUp}
            className="card h-full"
          >
            <Quote className="h-6 w-6 text-champagne" />
            <p className="mt-4 text-sm text-offwhite/90">{item.quote}</p>
            <p className="mt-4 text-sm font-semibold text-offwhite">{item.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="cenik" className="section-container">
      <motion.div {...fadeInUp} className="max-w-3xl">
        <h2 className="section-title">Orientace v ceně</h2>
        <p className="section-subtitle">Každý projekt je jiný. Tady je rychlý přehled nejčastějších scén.</p>
      </motion.div>
      <motion.div
        {...staggerContainer}
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {pricing.map((tier) => (
          <motion.div
            key={tier.name}
            {...fadeInUp}
            className={`card h-full ${tier.accent ? "border-champagne/60 shadow-glow" : ""}`}
          >
            <h3 className="text-lg font-semibold text-offwhite">{tier.name}</h3>
            <p className="mt-2 text-2xl font-semibold text-champagne">{tier.price}</p>
            <p className="mt-3 text-sm text-stone">{tier.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-champagne">
              <CheckCircle2 className="h-4 w-4" /> Připravíme přesnou nabídku
            </div>
          </motion.div>
        ))}
      </motion.div>
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
      </motion.div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,420px]">
        <motion.div
          {...fadeInUp}
          className="card"
        >
          <h3 className="text-xl font-semibold text-offwhite">Co máte na mysli?</h3>
          <p className="mt-2 text-sm text-stone">
            Popište prostor, účel, rozměry, styl… nebo prostě napište: „Chci aby to vypadalo hustě.“
            Nic není špatně.
          </p>
          <ContactForm />
        </motion.div>
        <motion.div
          {...fadeInUp}
          className="card h-full"
        >
          <h4 className="text-lg font-semibold text-offwhite">Co se stane po odeslání?</h4>
          <ul className="mt-4 space-y-3 text-sm text-stone">
            <li>• Ozveme se do 24 hodin.</li>
            <li>• Domluvíme styl, úhly a termíny.</li>
            <li>• Připravíme rychlý odhad ceny.</li>
            <li>• Dodáme vizualizaci, která prodává.</li>
          </ul>
          <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-br from-charcoal/80 to-obsidian/70 p-4 text-sm text-offwhite/90">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-champagne" />
              info@vizualio.cz
            </p>
            <p className="mt-2 text-stone">Telefon? Napište a zavoláme vám zpět.</p>
          </div>
        </motion.div>
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


