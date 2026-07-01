import { getServerRepositories } from "@/server";
import { ProjectList } from "./project-list";

export async function AdminProjectListContent() {
  const { projects } = await getServerRepositories();
  const items = await projects.getAll();

  if (items.length === 0) {
    return (
      <section className="dark:border-gray-850 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
        <span className="text-4xl">🗂️</span>
        <p className="text-navy mt-4 font-semibold dark:text-gray-200">
          등록된 시공사례가 아직 없습니다.
        </p>
        <p className="text-gray-dark mt-1.5 text-xs dark:text-gray-400">
          우측 상단 버튼을 클릭해 첫 번째 포트폴리오를 채워보세요.
        </p>
      </section>
    );
  }

  return <ProjectList items={items} />;
}
