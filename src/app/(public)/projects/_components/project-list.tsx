import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";

interface Props {
  category?: string;
}

export async function ProjectList({ category }: Props) {
  const { projects } = await getServerRepositories();
  const items = await projects.getAll(category);

  if (items.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-gray-dark text-lg dark:text-gray-400">시공 사례 사진 준비중입니다.</p>
        <p className="text-gray-dark mt-2 text-sm dark:text-gray-500">
          곧 다양한 시공 사례를 만나보실 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={ROUTES.projectDetail(item.id)}
            className="group block overflow-hidden rounded-lg"
          >
            {item.primary_image || item.images.length > 0 ? (
              <Image
                src={item.primary_image ?? item.images[0]}
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
              <span className="text-accent text-xs">{item.categories.join(", ")}</span>
              <h2 className="text-navy line-clamp-2 text-sm font-medium dark:text-white">
                {item.title}
              </h2>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
