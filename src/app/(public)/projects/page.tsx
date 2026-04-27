import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { projects } = await getServerRepositories();
  const [items, categories] = await Promise.all([
    projects.getAll(category),
    projects.getCategories(),
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold text-navy dark:text-white">포트폴리오</h1>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="카테고리 필터">
        <Link
          href="/projects"
          className={`shrink-0 rounded px-3 py-2 text-sm ${!category ? "bg-navy text-white" : "bg-gray-light text-gray-dark dark:bg-gray-800 dark:text-gray-300"}`}
        >
          전체
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/projects?category=${cat}`}
            className={`shrink-0 rounded px-3 py-2 text-sm ${category === cat ? "bg-navy text-white" : "bg-gray-light text-gray-dark dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-dark dark:text-gray-400">등록된 항목이 없습니다.</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/projects/${item.id}`}
                className="block overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
              >
                {item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
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
                  <span className="text-xs text-navy dark:text-blue-400">{item.category}</span>
                  <h2 className="mt-1 font-semibold text-navy dark:text-white">{item.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-dark dark:text-gray-300">{item.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
