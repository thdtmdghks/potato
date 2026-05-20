import Link from "next/link";
import { getServerRepositories } from "@/server";
import { BUSINESS, LINKS } from "@/shared/constants";
import { ProjectCarousel } from "./_components/project-carousel";

export default async function Home() {
  const { projects } = await getServerRepositories();
  const recentProjects = await projects.getAll();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS.name,
    description: BUSINESS.description,
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "원효로40길 64-8",
      addressLocality: "경산시",
      addressRegion: "경상북도",
      addressCountry: "KR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
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
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            외풍·소음, 오래된 샤시 고민 한번에 해결해 드립니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              ⚡ {BUSINESS.region} 당일 시공
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              🏆 LX, KCC, 예림 자재
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              🏅 풍부한 경험
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              🔧 확실한 A/S
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              💯 꼼꼼한 공사
            </span>
          </div>
          <a
            href={LINKS.tel}
            className="bg-accent hover:bg-accent-dark mt-8 inline-block rounded-lg px-8 py-3 text-lg font-bold text-white transition-colors"
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
          <Link href="/projects" className="text-navy hover:text-accent text-sm dark:text-blue-400">
            전체보기 →
          </Link>
        </div>
      </section>

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
