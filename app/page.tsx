import type { Metadata } from "next";
import { HomePageClient } from "@/app/_components/HomePageClient";
import { CONTACT_EMAIL } from "@/lib/site";
import { absoluteUrl, organizationSchema, servicesSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "3D vizualizace pro stavbu domu, rekonstrukce a reality | Vizualio",
  description:
    "Fotorealistické 3D vizualizace interiéru i exteriéru pro stavbu domu, rekonstrukce, návrh kuchyně i realitní kanceláře.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "3D vizualizace pro stavbu domu, rekonstrukce a reality | Vizualio",
    description:
      "Fotorealistické 3D vizualizace interiéru i exteriéru pro stavbu domu, rekonstrukce, návrh kuchyně i realitní kanceláře.",
    url: absoluteUrl("/")
  },
  twitter: {
    title: "3D vizualizace pro stavbu domu, rekonstrukce a reality | Vizualio",
    description:
      "Fotorealistické 3D vizualizace interiéru i exteriéru pro stavbu domu, rekonstrukce, návrh kuchyně i realitní kanceláře."
  }
};

export default function HomePage() {
  const organizationJsonLd = organizationSchema({ email: CONTACT_EMAIL });
  const servicesJsonLd = servicesSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
