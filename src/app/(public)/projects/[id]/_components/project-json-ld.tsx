import type { Project } from "@/shared/types";
import { BUSINESS } from "@/shared/constants";

export function ProjectJsonLd({ project }: { project: Project }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.primary_image
      ? [project.primary_image, ...project.images.filter((img) => img !== project.primary_image)]
      : project.images.length > 0
        ? project.images
        : ["/og-image.png"],
    datePublished: new Date(project.created_at).toISOString(),
    author: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "원효로40길 64-8",
        addressLocality: "경산시",
        addressRegion: "경상북도",
        addressCountry: "KR",
      },
    },
    publisher: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "원효로40길 64-8",
        addressLocality: "경산시",
        addressRegion: "경상북도",
        addressCountry: "KR",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
