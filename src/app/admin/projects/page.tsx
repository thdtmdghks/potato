import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import { AdminProjectListContent } from "./_components/admin-project-list-content";
import { AdminProjectListSkeleton } from "./_components/admin-project-list-skeleton";

export default function AdminProjects() {
  return (
    <main className="space-y-8">
      {/* 상단 헤더 영역 */}
      <header className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h1 className="text-navy text-2xl font-bold sm:text-3xl dark:text-white">
            시공사례 포트폴리오 관리
          </h1>
          <p className="text-gray-dark mt-1 text-sm dark:text-gray-400">
            고객들에게 보여줄 실제 시공사례 포트폴리오를 등록하고 관리합니다.
          </p>
        </div>
        <Link
          href={ROUTES.admin.projectsNew}
          className="bg-navy hover:bg-navy-light inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <span>✨ 새 시공사례 등록</span>
        </Link>
      </header>

      {/* 포트폴리오 리스트 영역 */}
      <Suspense fallback={<AdminProjectListSkeleton />}>
        <AdminProjectListContent />
      </Suspense>
    </main>
  );
}
