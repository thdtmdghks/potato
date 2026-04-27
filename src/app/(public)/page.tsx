import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";

const services = [
  { icon: "🌐", title: "웹 개발", description: "반응형 웹사이트와 웹 애플리케이션을 구축합니다." },
  { icon: "📱", title: "앱 개발", description: "iOS와 Android를 동시에 지원하는 크로스플랫폼 앱을 만듭니다." },
  { icon: "🎨", title: "디자인", description: "브랜드 아이덴티티부터 UI/UX까지 디자인합니다." },
  { icon: "📈", title: "마케팅", description: "SEO 최적화와 디지털 마케팅 전략을 제공합니다." },
];

export default async function Home() {
  const { projects, products } = await getServerRepositories();
  const [recentProjects, allProducts] = await Promise.all([
    projects.getAll(),
    products.getAll(),
  ]);
  const highlightProjects = recentProjects.slice(0, 3);
  const highlightProducts = allProducts.slice(0, 3);

  return (
    <>
      {/* 히어로 */}
      <section className="py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold text-navy dark:text-white md:text-5xl">
          비즈니스를 위한 디지털 솔루션
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-dark dark:text-gray-300">
          웹사이트, 앱, 디자인까지 — 비즈니스 성장에 필요한 모든 것을 제공합니다.
        </p>
        <Link
          href="/inquiry"
          className="mt-8 inline-block rounded-lg bg-navy px-8 py-3 text-white transition-colors hover:bg-navy-light"
        >
          무료 견적 받기
        </Link>
      </section>

      {/* 서비스 소개 */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-bold text-navy dark:text-white">서비스</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.title} className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
              <span className="text-4xl" role="img" aria-label={s.title}>{s.icon}</span>
              <h3 className="mt-4 font-semibold text-navy dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-dark dark:text-gray-300">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 포트폴리오 하이라이트 */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-bold text-navy dark:text-white">포트폴리오</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlightProjects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`} className="block overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700">
                {p.images.length > 0 ? (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    width={800}
                    height={600}
                    className="aspect-4/3 w-full object-cover"
                  />
                ) : (
                  <span className="flex aspect-4/3 items-center justify-center bg-gray-light text-gray-dark dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
                    이미지 없음
                  </span>
                )}
                <div className="p-4">
                  <span className="text-xs text-navy dark:text-blue-400">{p.category}</span>
                  <h3 className="mt-1 font-semibold text-navy dark:text-white">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-dark dark:text-gray-300">{p.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <Link href="/projects" className="text-navy underline hover:text-navy-light dark:text-blue-400">
            전체 포트폴리오 보기 →
          </Link>
        </p>
      </section>

      {/* 제품 요약 */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-bold text-navy dark:text-white">제품 안내</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlightProducts.map((p) => (
            <li key={p.id} className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-navy dark:text-white">{p.name}</h3>
              <p className="mt-2 text-sm text-gray-dark dark:text-gray-300">{p.description}</p>
              {p.features.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-sm text-gray-dark dark:text-gray-400">✓ {f}</li>
                  ))}
                  {p.features.length > 3 && (
                    <li className="text-sm text-gray-dark dark:text-gray-500">외 {p.features.length - 3}개</li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <Link href="/products" className="text-navy underline hover:text-navy-light dark:text-blue-400">
            전체 제품 보기 →
          </Link>
        </p>
      </section>

      {/* 견적문의 CTA */}
      <section className="my-12 rounded-lg bg-navy p-8 text-center text-white md:p-12">
        <h2 className="text-2xl font-bold">프로젝트를 시작할 준비가 되셨나요?</h2>
        <p className="mt-2 text-gray-300">무료 상담을 통해 최적의 솔루션을 제안해 드립니다.</p>
        <Link
          href="/inquiry"
          className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-navy transition-colors hover:bg-gray-100"
        >
          견적문의 하기
        </Link>
      </section>
    </>
  );
}
