import Link from "next/link";
import { getServerRepositories } from "@/lib/server-repositories";
import type { Project } from "@/lib/types";

async function getProjects(category?: string): Promise<Project[]> {
  try {
    const { projects } = await getServerRepositories();
    return projects.getAll(category);
  } catch {
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const { projects } = await getServerRepositories();
    return projects.getCategories();
  } catch {
    return [];
  }
}

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [items, categories] = await Promise.all([getProjects(category), getCategories()]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">포트폴리오</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/projects" className={`rounded px-3 py-1 ${!category ? "bg-navy text-white" : "bg-gray-light"}`}>
          전체
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/projects?category=${cat}`}
            className={`rounded px-3 py-1 ${category === cat ? "bg-navy text-white" : "bg-gray-light"}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-dark">등록된 항목이 없습니다.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/projects/${item.id}`} className="rounded-lg border p-4 hover:shadow">
              <div className="mb-2 h-40 rounded bg-gray-light" />
              <h3 className="font-semibold">{item.title}</h3>
              <span className="text-sm text-gray-dark">{item.category}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
