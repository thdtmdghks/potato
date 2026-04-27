import Link from "next/link";
import Image from "next/image";
import { getServerRepositories } from "@/server";

export default async function AdminProducts() {
  const { products } = await getServerRepositories();
  const items = await products.getAll();

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">제품 관리</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-navy px-4 py-2 text-sm text-white hover:bg-navy-light">
          새 제품
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-dark dark:text-gray-400">등록된 제품이 없습니다.</p>
      ) : (
        <>
          {/* 모바일: 카드 */}
          <ul className="mt-6 space-y-3 md:hidden">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="font-semibold text-navy dark:text-white">{item.name}</p>
                <p className="mt-1 text-sm text-gray-dark dark:text-gray-300">{item.category} · 특징 {item.features.length}개</p>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/products/${item.id}/edit`} className="text-sm text-navy underline dark:text-blue-400">수정</Link>
                  <button className="text-sm text-red-500 hover:text-red-700">삭제</button>
                </div>
              </li>
            ))}
          </ul>

          {/* 데스크톱: 테이블 */}
          <div className="mt-6 hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="col" className="py-2 pr-4 font-medium text-gray-dark dark:text-gray-300">이미지</th>
                  <th scope="col" className="py-2 pr-4 font-medium text-gray-dark dark:text-gray-300">제품명</th>
                  <th scope="col" className="py-2 pr-4 font-medium text-gray-dark dark:text-gray-300">카테고리</th>
                  <th scope="col" className="py-2 pr-4 font-medium text-gray-dark dark:text-gray-300">특징</th>
                  <th scope="col" className="py-2 font-medium text-gray-dark dark:text-gray-300">관리</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4">
                      {item.image ? (
                        <Image src={item.image} alt="" width={80} height={60} className="h-10 w-14 rounded object-cover" />
                      ) : (
                        <span className="inline-block h-10 w-14 rounded bg-gray-light dark:bg-gray-800" />
                      )}
                    </td>
                    <td className="py-2 pr-4 text-navy dark:text-white">{item.name}</td>
                    <td className="py-2 pr-4 dark:text-gray-300">{item.category}</td>
                    <td className="py-2 pr-4 dark:text-gray-300">{item.features.length}개</td>
                    <td className="py-2">
                      <Link href={`/admin/products/${item.id}/edit`} className="mr-3 text-navy underline dark:text-blue-400">수정</Link>
                      <button className="text-red-500 hover:text-red-700">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
