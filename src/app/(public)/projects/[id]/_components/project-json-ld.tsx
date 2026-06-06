import type { Project } from "@/shared/types";
import { BUSINESS, SITE_URL } from "@/shared/constants";

export function ProjectJsonLd({ project }: { project: Project }) {
  const images = project.primary_image
    ? [project.primary_image, ...project.images.filter((img) => img !== project.primary_image)]
    : project.images.length > 0
      ? project.images
      : [`${SITE_URL}/og-image.png`];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS.name,
    image: images,
    telephone: BUSINESS.phone,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "원효로40길 64-8",
      addressLocality: "경산시",
      addressRegion: "경상북도",
      postalCode: "38634",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.8306,
      longitude: 128.7562,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "창호 및 샤시 시공 서비스",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${project.category} 시공 — ${project.title}`,
            description: project.description,
            provider: {
              "@type": "LocalBusiness",
              name: BUSINESS.name,
            },
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
