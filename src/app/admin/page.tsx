import { getServerRepositories } from "@/server";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";

export default async function AdminDashboard() {
  const { projects } = await getServerRepositories();
  const allProjects = await projects.getAll();

  const totalCount = allProjects.length;

  // 카테고리별 시공사례 수 계산
  const categoryMap = allProjects.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryStats = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  const recentProjects = allProjects.slice(0, 5);

  // 최근 30일 이내 등록된 시공사례 수 계산
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent30DaysCount = allProjects.filter(
    (p) => new Date(p.created_at) >= thirtyDaysAgo,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-navy text-3xl font-extrabold tracking-tight dark:text-white">
          대시보드
        </h1>
        <p className="text-gray-dark mt-2 text-sm dark:text-gray-400">
          경산창호 시공사례 현황을 한눈에 관리합니다.
        </p>
      </div>

      {/* 메트릭 카드 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-dark text-xs font-semibold tracking-wider uppercase dark:text-gray-400">
            전체 시공사례
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-navy text-4xl font-extrabold dark:text-white">{totalCount}</span>
            <span className="text-gray-dark text-sm dark:text-gray-400">건</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-dark text-xs font-semibold tracking-wider uppercase dark:text-gray-400">
            등록된 카테고리
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-navy text-4xl font-extrabold dark:text-white">
              {categoryStats.length}
            </span>
            <span className="text-gray-dark text-sm dark:text-gray-400">개</span>
          </div>
        </div>

        <div className="col-span-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:col-span-1 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-dark text-xs font-semibold tracking-wider uppercase dark:text-gray-400">
            최근 30일 등록
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-navy text-4xl font-extrabold dark:text-white">
              {recent30DaysCount}
            </span>
            <span className="text-gray-dark text-sm dark:text-gray-400">건</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 최근 등록된 시공사례 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h2 className="text-navy text-lg font-bold dark:text-white">최근 시공사례</h2>
            <Link
              href={ROUTES.admin.projects}
              className="text-accent text-sm font-semibold hover:underline"
            >
              전체 보기 →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-gray-dark mt-6 py-10 text-center dark:text-gray-400">
              등록된 시공사례가 없습니다.
            </p>
          ) : (
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-100 dark:divide-gray-800">
                {recentProjects.map((project) => (
                  <li key={project.id} className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-gray-100 bg-gray-50 dark:border-gray-800">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            이미지 없음
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-navy truncate text-sm font-bold dark:text-white">
                          {project.title}
                        </p>
                        <p className="text-gray-dark truncate text-xs dark:text-gray-400">
                          {project.category} · {project.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-dark text-xs dark:text-gray-400">
                          {new Date(project.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 카테고리 분포 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-navy text-lg font-bold dark:text-white">카테고리 현황</h2>
          {categoryStats.length === 0 ? (
            <p className="text-gray-dark mt-6 py-10 text-center dark:text-gray-400">
              데이터가 없습니다.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {categoryStats.map(({ category, count }) => (
                <li key={category} className="flex items-center justify-between">
                  <span className="text-navy text-sm font-semibold dark:text-gray-300">
                    {category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-navy text-sm font-extrabold dark:text-white">
                      {count}건
                    </span>
                    <span className="text-gray-dark text-xs dark:text-gray-400">
                      ({Math.round((count / totalCount) * 100)}%)
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
