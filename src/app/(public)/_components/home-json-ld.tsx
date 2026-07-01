import { BUSINESS } from "@/shared/constants";
import { getHomeProjects, getHomeReviews } from "../_utils";

export async function HomeJsonLd() {
  const [projects, reviews] = await Promise.all([getHomeProjects(), getHomeReviews()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS.name,
    alternateName: ["경산샤시", "경산샷시", "대구샤시", "대구샷시"],
    description: BUSINESS.description,
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "원효로40길 64-8",
      addressLocality: "경산시",
      addressRegion: "경상북도",
      addressCountry: "KR",
    },
    areaServed: [
      { "@type": "City", name: "경산시" },
      { "@type": "City", name: "대구광역시" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    ...(projects.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "시공사례",
            itemListElement: projects.slice(0, 10).map((p) => ({
              "@type": "Offer",
              name: p.title,
              description: p.description?.slice(0, 100),
              category: p.categories.join(", "),
            })),
          },
        }
      : {}),
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(
              (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            ),
            reviewCount: reviews.length,
            bestRating: 5,
          },
          review: reviews.map((rev) => ({
            "@type": "Review",
            author: { "@type": "Person", name: rev.author_name },
            datePublished: new Date(rev.created_at).toISOString().split("T")[0],
            reviewBody: rev.content,
            reviewRating: {
              "@type": "Rating",
              ratingValue: rev.rating,
              bestRating: 5,
            },
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
