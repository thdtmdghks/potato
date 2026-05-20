import Image from "next/image";
import { getServerRepositories } from "@/server";

export default async function Products() {
  const { products } = await getServerRepositories();
  const items = await products.getAll();

  return (
    <>
      <h1 className="text-navy text-3xl font-bold dark:text-white">제품 안내</h1>
      <p className="text-gray-dark mt-2 dark:text-gray-300">
        비즈니스 규모에 맞는 최적의 패키지를 선택하세요.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                width={600}
                height={400}
                className="aspect-4/3 w-full object-cover"
              />
            ) : (
              <span
                className="bg-gray-light text-gray-dark flex aspect-4/3 items-center justify-center dark:bg-gray-800 dark:text-gray-500"
                aria-hidden="true"
              >
                이미지 없음
              </span>
            )}
            <article className="p-6">
              <span className="text-navy text-xs dark:text-blue-400">{p.category}</span>
              <h2 className="text-navy mt-1 text-xl font-semibold dark:text-white">{p.name}</h2>
              <p className="text-gray-dark mt-2 text-sm dark:text-gray-300">{p.description}</p>
              {p.features.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {p.features.map((f) => (
                    <li key={f} className="text-gray-dark text-sm dark:text-gray-400">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
