import { Suspense } from "react";
import Image from "next/image";
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
import { BUSINESS, LINKS, CATEGORIES } from "@/shared/constants";
import { ProjectCarouselSection } from "./_components/project-carousel-section";
import { ReviewCarouselSection } from "./_components/review-carousel-section";
import { ProjectCarouselSkeleton } from "./_components/project-carousel-skeleton";
import { ReviewCarouselSkeleton } from "./_components/review-carousel-skeleton";

const HERO_BADGES = [
  { emoji: "⚡", label: `${BUSINESS.region} 당일 시공` },
  { emoji: "🏆", label: "LX, KCC, 예림 자재" },
  { emoji: "🏅", label: "풍부한 경험" },
  { emoji: "🔧", label: "확실한 A/S" },
  { emoji: "💯", label: "꼼꼼한 공사" },
] as const;

const CATEGORY_ICONS: Record<
  (typeof CATEGORIES)[number],
  React.ComponentType<{ className?: string }>
> = {
  하이샤시: AppWindow,
  방충망: Grid,
  유리: Sparkles,
  ABS도어: DoorClosed,
  방범창: Shield,
  잡철: Wrench,
  방화문: Flame,
  스텐: Construction,
  판넬: Layers,
};

export default function Home() {
  return (
    <>
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
            {HERO_BADGES.map(({ emoji, label }) => (
              <span
                key={label}
                className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm"
              >
                {emoji} {label}
              </span>
            ))}
          </div>

          {/* 시공 품목 그리드 */}
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <p className="text-accent mb-4 text-xs font-bold tracking-wider uppercase">
              전문 시공 품목
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <div
                    key={cat}
                    className="flex flex-col items-center justify-center rounded-xl bg-white/5 px-2 py-3.5 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:shadow-lg"
                  >
                    <Icon className="text-accent mb-2 h-5 w-5" />
                    <span className="text-[11px] font-semibold text-gray-200 md:text-xs">
                      {cat}
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

      {/* 시공사례 캐러셀 */}
      <Suspense fallback={<ProjectCarouselSkeleton />}>
        <ProjectCarouselSection />
      </Suspense>

      {/* 시공후기 캐러셀 + JSON-LD */}
      <Suspense fallback={<ReviewCarouselSkeleton />}>
        <ReviewCarouselSection />
      </Suspense>

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
            <div className="flex flex-col gap-2.5">
              <a
                href={LINKS.naverMap}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <Image
                  src="/place.webp"
                  alt={`${BUSINESS.name} 위치 지도`}
                  width={800}
                  height={256}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-gray-800 shadow-md backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-100">
                    🔍 네이버 지도로 자세히 보기
                  </span>
                </div>
              </a>
              <a
                href={LINKS.naverMap}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                💚 네이버 지도에서 길찾기
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
