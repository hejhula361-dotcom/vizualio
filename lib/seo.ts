import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vizualio.cz";
export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const SITE_NAME = "Vizualio";
export const DEFAULT_LOCALE = "cs_CZ";

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function buildDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Vizualio — Fotorealistické 3D vizualizace",
      template: `%s | ${SITE_NAME}`
    },
    description: "Fotorealistické 3D vizualizace interiérů, exteriérů a produktů na míru.",
    alternates: {
      canonical: "/"
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      type: "website",
      locale: DEFAULT_LOCALE,
      url: SITE_URL,
      siteName: SITE_NAME,
      title: "Vizualio — Fotorealistické 3D vizualizace",
      description: "Fotorealistické 3D vizualizace interiérů, exteriérů a produktů na míru."
    },
    twitter: {
      card: "summary_large_image",
      title: "Vizualio — Fotorealistické 3D vizualizace",
      description: "Fotorealistické 3D vizualizace interiérů, exteriérů a produktů na míru."
    },
    icons: {
      icon: "/img/favicon.svg"
    }
  };
}

type OrganizationSchema = {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  email?: string;
  sameAs?: string[];
};

type ServiceSchema = {
  "@context": "https://schema.org";
  "@type": "Service";
  serviceType: string;
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  areaServed: string;
};

export function organizationSchema(params?: { email?: string }): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: params?.email,
    sameAs: ["https://www.instagram.com/vizualio.cz/"]
  };
}

export function servicesSchema(): ServiceSchema[] {
  const serviceTypes = [
    "3D vizualizace",
    "Vizualizace stavby domu",
    "Vizualizace rekonstrukce",
    "Vizualizace kuchyně"
  ];

  return serviceTypes.map((serviceType) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL
    },
    areaServed: "CZ"
  }));
}
