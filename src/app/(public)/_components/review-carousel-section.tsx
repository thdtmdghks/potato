import Link from "next/link";
import { BUSINESS } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { getHomeReviews } from "../_utils";
import { ReviewCarousel } from "./review-carousel";

export async function ReviewCarouselSection() {
  const approvedReviews = await getHomeReviews();

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
    },
    ...(approvedReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
            ).toFixed(1),
            reviewCount: String(approvedReviews.length),
            bestRating: "5",
          },
          review: approvedReviews.map((rev) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: rev.author_name,
            },
            datePublished: new Date(rev.created_at).toISOString().split("T")[0],
            reviewBody: rev.content,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(rev.rating),
              bestRating: "5",
            },
          })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {approvedReviews.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/30 py-20 dark:border-gray-800 dark:bg-gray-950/10">
          <div className="mx-auto mb-12 max-w-5xl px-4 text-center">
            <h2 className="text-navy text-2xl font-bold dark:text-white">고객 시공 후기</h2>
            <p className="text-gray-dark mt-2 text-sm dark:text-gray-400">
              실제 경산창호를 이용하신 고객님들의 생생한 한마디입니다
            </p>
          </div>
          <ReviewCarousel reviews={approvedReviews} />
          <div className="mt-8 text-center">
            <Link
              href={ROUTES.reviews}
              className="text-accent text-sm font-semibold hover:underline"
            >
              전체 후기 보기 →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
