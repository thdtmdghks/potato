import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import { InviteLinkSection } from "./reviews/_components/invite-link-section";
import { DashboardStats } from "./_components/dashboard-stats";
import { DashboardStatsSkeleton } from "./_components/dashboard-stats-skeleton";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-navy text-2xl font-bold dark:text-white">대시보드</h1>
        <p className="text-gray-dark mt-1 text-sm dark:text-gray-400">
          빠른 액션과 현황을 확인합니다.
        </p>
      </div>

      {/* 빠른 액션 */}
      <section className="grid gap-4 sm:grid-cols-2">
        <InviteLinkSection />
        <Link
          href={ROUTES.admin.projectsNew}
          className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <span className="text-xl">➕</span>
          <span className="text-navy dark:text-white">새 프로젝트 등록</span>
        </Link>
      </section>

      {/* 현황 카드 */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
