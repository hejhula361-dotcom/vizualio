"use client";

import { useState } from "react";
import Image from "next/image";
import { getPortfolioImageUrl } from "@/lib/supabase";

type PortfolioImageProps = {
  /** Název souboru v bucketu (portfolio-images) */
  src: string;
  alt: string;
  /** První obrázky v mřížce – načtou se hned (priority) */
  priority?: boolean;
  /** Pro mřížku: menší rozměr = rychlejší načtení (Supabase Pro – Image Transformations) */
  thumbnailWidth?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  /** Pro lightbox / velký obrázek – bez thumbnail */
  fullSize?: boolean;
};

/**
 * Obrázek z portfolia s lazy loadingem a skeleton placeholderm.
 * – priority = načíst hned (první řádky)
 * – bez priority = loading="lazy", fetchPriority="low"
 * – skeleton zmizí po onLoad
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
  const [loaded, setLoaded] = useState(false);
  const url = fullSize
    ? getPortfolioImageUrl(src)
    : getPortfolioImageUrl(src, thumbnailWidth ? { width: thumbnailWidth, quality: 75 } : undefined);

  return (
    <span className="relative block h-full w-full">
      {/* Skeleton – zmizí po načtení obrázku */}
      {!loaded && (
        <span
          className="absolute inset-0 z-0 bg-charcoal/80 animate-pulse rounded-2xl"
          aria-hidden
        />
      )}
      <Image
        src={url}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
