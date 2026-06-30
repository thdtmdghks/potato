import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, SITE_URL } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { ProjectList } from "./_components/project-list";
import { ProjectListSkeleton } from "./_components/project-list-skeleton";

export const metadata: Metadata = {
  title: "시공사례 갤러리 | 경산창호",
  description:
    "경산 대구 지역의 하이샤시(샷시), 이중유리, 방충망, ABS도어 시공 갤러리. 경산창호가 당일 직접 시공한 현장 포트폴리오를 확인하세요.",
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
};

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-navy text-3xl font-bold dark:text-white">시공사례</h1>
      <p className="text-gray-dark mt-2 dark:text-gray-300">경산창호의 시공 현장을 확인하세요.</p>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="카테고리 필터">
        <Link
          href={ROUTES.projects}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${!category ? "bg-navy text-white" : "bg-gray-light text-gray-dark hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}
        >
          전체
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`${ROUTES.projects}?category=${cat}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat ? "bg-navy text-white" : "bg-gray-light text-gray-dark hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList category={category} />
      </Suspense>
    </div>
  );
}
