"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getPortfolioImageUrl } from "@/lib/supabase";

type PortfolioImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  thumbnailWidth?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  fullSize?: boolean;
};

/** rootMargin pro Intersection Observer – načíst obrázek už před vstupem do viewportu */
const LAZY_ROOT_MARGIN = "400px 0px";

/**
 * Obrázek z portfolia:
 * – Místo černého placeholdera: jemný tmavý gradient, pak blur-up (obrázek nejdřív rozmazaný, pak ostrý).
 * – Bez priority: načte se až když je blízko viewportu (Intersection Observer).
 */
export function PortfolioImage({
  src,
  alt,
  priority = false,
  thumbnailWidth,
  fill,
  width,
  height,
  sizes,
  className,
  fullSize = false
}: PortfolioImageProps) {
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [sharpened, setSharpened] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const url = fullSize
    ? getPortfolioImageUrl(src)
    : getPortfolioImageUrl(src, thumbnailWidth ? { width: thumbnailWidth, quality: 75 } : undefined);

  useEffect(() => {
    if (priority) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { rootMargin: LAZY_ROOT_MARGIN, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setSharpened(true), 50);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <span ref={containerRef} className="relative block h-full w-full overflow-hidden rounded-2xl">
      {/* Placeholder: jemný gradient místo černé */}
      {(!inView || !loaded) && (
        <span
          className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-stone-800/95 to-carbon/95"
          aria-hidden
        />
      )}

      {inView && (
        <Image
          src={url}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          className={`relative z-10 object-cover transition-all duration-500 ease-out ${className ?? ""} ${
            !loaded
              ? "opacity-0 blur-xl scale-105"
              : sharpened
                ? "opacity-100 blur-0 scale-100"
                : "opacity-100 blur-xl scale-105"
          }`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      )}
    </span>
  );
}
