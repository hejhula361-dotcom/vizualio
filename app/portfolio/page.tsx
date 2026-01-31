"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Instagram, ChevronLeft, ChevronRight, X } from "lucide-react";

const categories = [
  { id: "vse", label: "Vše" },
  { id: "interier", label: "Interiér" },
  { id: "exterier", label: "Exteriér" },
  { id: "pudorys", label: "Půdorys" },
  { id: "skrine", label: "Skříně" },
  { id: "stylizovana", label: "Stylizovaná" }
] as const;

type CategoryId = (typeof categories)[number]["id"];

const portfolioItems = [
  { title: "Obývací pokoj s výhledem", category: "interier" as CategoryId, src: "/img/viz1.png" },
  { title: "Předsíňová skříň", category: "skrine" as CategoryId, src: "/img/viz2.png" },
  { title: "Šatní skříň", category: "skrine" as CategoryId, src: "/img/viz3.png" },
  { title: "Moderní dům na kopci", category: "exterier" as CategoryId, src: "/img/viz4.png" },
  { title: "Koupelna s vanou", category: "interier" as CategoryId, src: "/img/viz5.png" },
  { title: "Koupelna s pračkou", category: "interier" as CategoryId, src: "/img/viz6.png" },
  { title: "Obývací pokoj se schodištěm", category: "interier" as CategoryId, src: "/img/viz1.png" },
  { title: "Půdorys domu", category: "pudorys" as CategoryId, src: "/img/viz2.png" },
  { title: "Jídelna s kuchyní", category: "interier" as CategoryId, src: "/img/viz3.png" },
  { title: "Půdorys domu shora", category: "pudorys" as CategoryId, src: "/img/viz4.png" },
  { title: "Půdorys bytu", category: "pudorys" as CategoryId, src: "/img/viz5.png" },
  { title: "Bílá kuchyně", category: "interier" as CategoryId, src: "/img/viz6.png" },
  { title: "Kuchyně s dřevěnými prvky", category: "interier" as CategoryId, src: "/img/viz1.png" },
  { title: "Moderní bílá kuchyně", category: "interier" as CategoryId, src: "/img/viz2.png" },
  { title: "Kuchyně v béžových tónech", category: "interier" as CategoryId, src: "/img/viz3.png" },
  { title: "Vestavěná skříň s knihovnou", category: "skrine" as CategoryId, src: "/img/viz4.png" },
  { title: "Dům u řeky – akvarel styl", category: "stylizovana" as CategoryId, src: "/img/viz5.png" },
  { title: "Kuchyně – japonský sketch styl", category: "stylizovana" as CategoryId, src: "/img/viz6.png" },
  { title: "3D půdorys bytu 4kk", category: "pudorys" as CategoryId, src: "/img/viz1.png" },
  { title: "2D technický půdorys s rozměry", category: "pudorys" as CategoryId, src: "/img/viz2.png" }
];

function getCategoryCount(id: CategoryId) {
  if (id === "vse") return portfolioItems.length;
  return portfolioItems.filter((i) => i.category === id).length;
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("vse");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const filtered =
    activeCategory === "vse"
      ? portfolioItems
      : portfolioItems.filter((i) => i.category === activeCategory);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const hasPrev = lightboxIndex !== null && lightboxIndex > 0;
  const hasNext = lightboxIndex !== null && lightboxIndex < filtered.length - 1;

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    setLightboxIndex((i) => (i === null ? null : i - 1));
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    setLightboxIndex((i) => (i === null ? null : i + 1));
  }, [hasNext]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartXRef.current;
    if (start === null) return;
    const delta = e.changedTouches[0].clientX - start;
    if (delta > 50) goPrev();
    if (delta < -50) goNext();
    touchStartXRef.current = null;
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="section-container pt-12 pb-9 md:pt-12 md:pb-9">
        <div className="text-center">
          <h1 className="section-title">Portfolio</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Ukázky našich 3D vizualizací – interiéry, exteriéry i půdorysy
          </p>
          <div className="w-20 h-0.5 bg-champagne/60 mx-auto mt-8" />
        </div>
      </section>

      {/* Filters */}
      <section className="section-container !pt-0 !pb-0">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-champagne text-carbon shadow-glow"
                    : "bg-white/10 text-stone hover:bg-white/20 hover:text-offwhite"
                }`}
              >
                {cat.label}
                {cat.id !== "vse" && (
                  <span className={isActive ? "ml-2 opacity-90" : "ml-2 text-xs opacity-70"}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="section-container">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.06 } }
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                layout
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.95 }}
                role="button"
                tabIndex={0}
                onClick={() => setLightboxIndex(i)}
                onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(i)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-charcoal/60 cursor-pointer will-change-transform"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-champagne/90 text-carbon text-xs font-bold uppercase rounded-full mb-2">
                      {categories.find((c) => c.id === item.category)?.label ?? item.category}
                    </span>
                    <p className="text-offwhite text-sm font-medium">{item.title}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Plus className="h-5 w-5 text-offwhite" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={closeLightbox}
          >
            <div
              className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Info nad obrázkem */}
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <span className="inline-block px-3 py-1 bg-champagne/90 text-carbon text-xs font-bold uppercase rounded-full">
                  {categories.find((c) => c.id === currentItem.category)?.label ?? currentItem.category}
                </span>
                <p className="text-offwhite text-lg font-medium">{currentItem.title}</p>
              </div>

              {/* Obrázek + šipky */}
              <div className="relative flex w-full flex-1 items-center justify-center">
                {hasPrev && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-offwhite transition hover:bg-champagne hover:text-carbon md:left-4"
                    aria-label="Předchozí"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                )}
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-[60vh] w-full flex-1 md:max-h-[75vh]"
                >
                  <Image
                    src={currentItem.src}
                    alt={currentItem.title}
                    width={1200}
                    height={900}
                    className="mx-auto max-h-[60vh] w-auto max-w-full object-contain md:max-h-[75vh]"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                  />
                </motion.div>
                {hasNext && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-offwhite transition hover:bg-champagne hover:text-carbon md:right-4"
                    aria-label="Další"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="mt-4 rounded-full bg-white/10 p-2 text-offwhite transition hover:bg-white/20"
                aria-label="Zavřít"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="section-container">
        <div className="rounded-2xl border border-white/10 border-dashed bg-charcoal/30 p-12 text-center">
          <h3 className="text-2xl font-semibold text-offwhite mb-4">Další realizace brzy</h3>
          <p className="text-stone max-w-md mx-auto mb-6">
            Pracujeme na nových projektech. Sledujte náš Instagram pro nejnovější práce.
          </p>
          <a
            href="https://instagram.com/vizualio.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-champagne hover:text-amber transition-colors font-medium"
          >
            <Instagram className="h-5 w-5" />
            @vizualio.cz
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-container border-t border-white/10 pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-offwhite mb-4">Máte projekt na vizualizaci?</h2>
          <p className="text-stone mb-8 max-w-md mx-auto">
            Rádi vám připravíme individuální nabídku podle vašeho zadání. Konzultace je zdarma.
          </p>
          <Link
            href="/#kontakt"
            className="inline-block rounded-full bg-champagne px-4 py-2 text-carbon text-sm font-medium shadow-glow transition hover:bg-amber"
          >
            Nezávazně poptat
          </Link>
        </div>
      </section>
    </div>
  );
}
