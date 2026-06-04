import Link from "next/link";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";
import { InviteLinkSection } from "./reviews/_components/invite-link-section";

export default async function AdminDashboard() {
  const { projects, reviews, reviewEdits } = await getServerRepositories();

  const [allProjects, pendingReviews, editRequests, approvedReviews] = await Promise.all([
    projects.getAll(),
    reviews.getAllPending(),
    reviewEdits.getAll(),
    reviews.getAllApproved(),
  ]);

  const stats = [
    {
      label: "신규 등록 대기",
      count: pendingReviews.length,
      href: ROUTES.admin.reviews,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      label: "수정 요청 대기",
      count: editRequests.length,
      href: ROUTES.admin.reviews,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      label: "시공사례",
      count: allProjects.length,
      href: ROUTES.admin.projects,
      color: "text-navy dark:text-blue-300",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "노출 중인 리뷰",
      count: approvedReviews.length,
      href: ROUTES.admin.reviews,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
  ];

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
      <section>
        <h2 className="text-navy mb-4 text-lg font-bold dark:text-white">현황</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-xl ${item.bg} p-4 transition-opacity hover:opacity-80`}
            >
              <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
              <span className={`text-lg font-bold ${item.color}`}>
                {typeof item.count === "number" ? `${item.count}건` : item.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
