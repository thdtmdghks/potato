import Link from "next/link";
import {
  AppWindow,
  Grid,
  Sparkles,
  DoorClosed,
  Shield,
  Wrench,
  Flame,
  Construction,
  Layers,
} from "lucide-react";
import { getServerRepositories } from "@/server";
import { BUSINESS, LINKS } from "@/shared/constants";
import { ProjectCarousel } from "./_components/project-carousel";
import { ReviewCarousel } from "./_components/review-carousel";
import { ROUTES } from "@/shared/routes";

const CATEGORIES = [
  { name: "하이샤시", icon: AppWindow },
  { name: "방충망", icon: Grid },
  { name: "유리", icon: Sparkles },
  { name: "ABS도어", icon: DoorClosed },
  { name: "방범창", icon: Shield },
  { name: "잡철", icon: Wrench },
  { name: "방화문", icon: Flame },
  { name: "스텐", icon: Construction },
  { name: "판넬", icon: Layers },
];

export default async function Home() {
  const { projects, reviews } = await getServerRepositories();
  const recentProjects = await projects.getAll();
  const approvedReviews = await reviews.getAllApproved();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
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
      {/* 히어로 */}
      <section className="from-navy to-navy-light bg-gradient-to-br py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold md:text-5xl">{BUSINESS.slogan}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            하이샤시, 방충망, 유리 교체부터 ABS도어, 방화문, 판넬, 잡철 및 스텐 공사까지!
            <br className="hidden sm:inline" />
            경산 대구 지역의 창호 및 종합 금속·잡철 시공을 확실하게 책임집니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm">
              ⚡ {BUSINESS.region} 당일 시공
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm">
              🏆 LX, KCC, 예림 자재
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm">
              🏅 풍부한 경험
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm">
              🔧 확실한 A/S
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm">
              💯 꼼꼼한 공사
            </span>
          </div>

          {/* 시공 품목 그리드 */}
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <p className="text-accent mb-4 text-xs font-bold tracking-wider uppercase">
              전문 시공 품목
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {CATEGORIES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex flex-col items-center justify-center rounded-xl bg-white/5 px-2 py-3.5 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:shadow-lg"
                  >
                    <Icon className="text-accent mb-2 h-5 w-5" />
                    <span className="text-[11px] font-semibold text-gray-200 md:text-xs">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <a
            href="#contact"
            className="bg-accent hover:bg-accent-dark mt-10 inline-block rounded-lg px-8 py-3 text-lg font-bold text-white transition-colors"
          >
            📞 상담·견적 문의하기
          </a>
        </div>
      </section>

      {/* 시공사례 */}
      <section id="gallery" className="pt-20 pb-10">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-navy text-center text-2xl font-bold dark:text-white">시공사례</h2>
          <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-400">
            실제 현장 시공 모습을 확인하세요
          </p>
        </div>
        <div className="mt-10">
          <ProjectCarousel projects={recentProjects} />
        </div>
        <div className="mx-auto mt-6 max-w-5xl px-4 text-right">
          <Link
            href={ROUTES.projects}
            className="text-navy hover:text-accent text-sm dark:text-blue-400"
          >
            전체보기 →
          </Link>
        </div>
      </section>

      {/* 시공후기 */}
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

      {/* 연락처 */}
      <section id="contact" className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-navy text-center text-2xl font-bold dark:text-white">
            상담·견적 문의
          </h2>
          <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-400">
            전화 한 통이면 빠른 견적 상담 가능합니다
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <dl className="space-y-3">
                <div className="flex gap-3">
                  <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">주소</dt>
                  <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.address}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">전화</dt>
                  <dd>
                    <a href={LINKS.tel} className="text-accent hover:underline">
                      {BUSINESS.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">영업</dt>
                  <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.closedDay}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-navy w-16 shrink-0 font-medium dark:text-gray-200">대표</dt>
                  <dd className="text-gray-dark dark:text-gray-300">{BUSINESS.owner}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={LINKS.tel}
                  className="bg-accent hover:bg-accent-dark rounded-lg px-5 py-2.5 font-semibold text-white transition-colors"
                >
                  📞 전화
                </a>
                <a
                  href={LINKS.sms}
                  className="bg-navy hover:bg-navy-light rounded-lg px-5 py-2.5 font-semibold text-white transition-colors"
                >
                  💬 문자
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg">
              <iframe
                src={LINKS.map}
                className="h-64 w-full border-0 md:h-full md:min-h-[250px]"
                allowFullScreen
                loading="lazy"
                title={`${BUSINESS.name} 위치`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
