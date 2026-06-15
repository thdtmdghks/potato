import Link from "next/link";
import { getServerRepositories } from "@/server";
import { ProjectList } from "./_components/project-list";
import { ROUTES } from "@/shared/routes";

export default async function AdminProjects() {
  const { projects } = await getServerRepositories();
  const items = await projects.getAll();

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
      {items.length === 0 ? (
        <section className="dark:border-gray-850 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <span className="text-4xl">🗂️</span>
          <p className="text-navy mt-4 font-semibold dark:text-gray-200">
            등록된 시공사례가 아직 없습니다.
          </p>
          <p className="text-gray-dark mt-1.5 text-xs dark:text-gray-400">
            우측 상단 버튼을 클릭해 첫 번째 포트폴리오를 채워보세요.
          </p>
        </section>
      ) : (
        <ProjectList items={items} />
      )}
    </main>
  );
}
