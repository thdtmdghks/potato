import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";
import { CATEGORIES } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { projects } = await getServerRepositories();
  const items = await projects.getAll(category);
  const categories = CATEGORIES;

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
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`${ROUTES.projects}?category=${cat}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat ? "bg-navy text-white" : "bg-gray-light text-gray-dark hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-dark text-lg dark:text-gray-400">시공 사례 사진 준비중입니다.</p>
          <p className="text-gray-dark mt-2 text-sm dark:text-gray-500">
            곧 다양한 시공 사례를 만나보실 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={ROUTES.projectDetail(item.id)}
                className="group block overflow-hidden rounded-lg"
              >
                {item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="aspect-4/3 w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <span className="bg-gray-light text-gray-dark flex aspect-4/3 items-center justify-center text-sm dark:bg-gray-800 dark:text-gray-500">
                    사진 준비중
                  </span>
                )}
                <div className="mt-2">
                  <span className="text-accent text-xs">{item.category}</span>
                  <h2 className="text-navy text-sm font-medium dark:text-white">{item.title}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
