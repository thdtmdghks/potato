import Link from "next/link";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";

export async function DashboardStats() {
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
  );
}
