import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";
import SvgIcon from "./_components/svg-icon";

const services = [
  {
    d: "M8 8h32v32H8zM8 24h32M24 8v32M12 12h8v8h-8zM28 12h8v8h-8z",
    title: "PVC 샷시",
    description: "결로·외풍 해결, 단열·방음 뛰어난 이중창",
  },
  {
    d: "M6 10h36v28H6zM6 24h36M24 10v28M10 14h4M34 14h4",
    title: "알루미늄 샷시",
    description: "슬림 프레임으로 넓은 시야, 내구성 우수",
  },
  {
    d: "M8 8h32v32H8zM8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32",
    title: "방충망",
    description: "미세먼지 차단 촘촘망, 롤·고정식 선택 가능",
  },
  {
    d: "M10 10h28v28H10zM10 10l28 28M38 10l-28 28",
    title: "유리교체",
    description: "복층유리·로이유리로 난방비 절감",
  },
  {
    d: "M14 6h20v36H14zM14 6a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4M30 24a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
    title: "ABS 도어",
    description: "습기에 강한 욕실 전용 도어, 다양한 색상",
  },
  {
    d: "M10 8h28v32H10zM16 8v32M22 8v32M28 8v32M34 8v32M10 16h28M10 24h28M10 32h28",
    title: "방범창",
    description: "1층·반지하 필수, 환기 가능한 스텐 방범창",
  },
];

const strengths = [
  { number: "40년", label: "샷시 시공 경력" },
  { number: "2014~", label: "경산창호 운영" },
  { number: "당일", label: "시공 가능" },
  { number: "경산·대구", label: "전 지역 출장" },
];

export default async function Home() {
  const { projects } = await getServerRepositories();
  const recentProjects = (await projects.getAll()).slice(0, 6);

  return (
    <>
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold md:text-5xl">경산·대구 샷시 전문 시공</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            외풍·결로·소음, 오래된 샷시 고민 한번에 해결해 드립니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              🏆 40년 경력
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              ⚡ 당일 시공
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              📍 경산·대구 전지역
            </span>
          </div>
          <a
            href="tel:010-3812-9922"
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-accent-dark"
          >
            📞 무료 상담·견적 받기
          </a>
        </div>
      </section>

      {/* 서비스 */}
      <section id="services" className="bg-gray-light py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy dark:text-white">
            이런 시공 합니다
          </h2>
          <p className="mt-2 text-center text-sm text-gray-dark dark:text-gray-400">
            샷시 교체부터 방충망·유리·도어까지 한번에
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.title}
                className="rounded-lg bg-white p-5 text-center shadow-sm dark:bg-gray-800"
              >
                <SvgIcon d={s.d} />
                <h3 className="mt-3 font-semibold text-navy dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-dark dark:text-gray-300">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 시공사례 */}
      <section id="gallery" className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy dark:text-white">시공사례</h2>
          <p className="mt-2 text-center text-sm text-gray-dark dark:text-gray-400">
            실제 현장 시공 모습을 확인하세요
          </p>
          {recentProjects.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {recentProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="block overflow-hidden rounded-lg">
                    {p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        width={400}
                        height={300}
                        className="aspect-4/3 w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <span className="flex aspect-4/3 items-center justify-center bg-gray-light text-sm text-gray-dark dark:bg-gray-800 dark:text-gray-500">
                        사진 준비중
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-center text-gray-dark dark:text-gray-400">
              시공 사례 사진 준비중입니다.
            </p>
          )}
          <p className="mt-6 text-center">
            <Link
              href="/projects"
              className="text-navy underline hover:text-accent dark:text-blue-400"
            >
              시공사례 더보기 →
            </Link>
          </p>
        </div>
      </section>

      {/* 강점 */}
      <section id="about" className="bg-gray-light py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy dark:text-white">
            경산창호를 선택하는 이유
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {strengths.map((s) => (
              <li key={s.label} className="text-center">
                <p className="text-3xl font-bold text-accent">{s.number}</p>
                <p className="mt-1 text-sm text-gray-dark dark:text-gray-300">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 연락처 */}
      <section id="contact" className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy dark:text-white">
            상담·견적 문의
          </h2>
          <p className="mt-2 text-center text-sm text-gray-dark dark:text-gray-400">
            전화 한 통이면 빠른 견적 상담 가능합니다
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <dl className="space-y-3">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-medium text-navy dark:text-gray-200">주소</dt>
                  <dd className="text-gray-dark dark:text-gray-300">경산시 원효로40길 64-8</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-medium text-navy dark:text-gray-200">전화</dt>
                  <dd>
                    <a href="tel:010-3812-9922" className="text-accent hover:underline">
                      010-3812-9922
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-medium text-navy dark:text-gray-200">영업</dt>
                  <dd className="text-gray-dark dark:text-gray-300">매주 일요일 휴무</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-medium text-navy dark:text-gray-200">대표</dt>
                  <dd className="text-gray-dark dark:text-gray-300">송정관</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="tel:010-3812-9922"
                  className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  📞 전화
                </a>
                <a
                  href="sms:010-3812-9922"
                  className="rounded-lg bg-navy px-5 py-2.5 font-semibold text-white transition-colors hover:bg-navy-light"
                >
                  💬 문자
                </a>
                <a
                  href="#"
                  className="rounded-lg bg-[#FEE500] px-5 py-2.5 font-semibold text-[#3C1E1E] transition-opacity hover:opacity-80"
                >
                  💛 카카오톡
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps?q=경산시+원효로40길+64-8&output=embed"
                className="h-64 w-full border-0 md:h-full md:min-h-[250px]"
                allowFullScreen
                loading="lazy"
                title="경산창호 위치"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
