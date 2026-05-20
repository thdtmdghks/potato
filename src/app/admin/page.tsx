import { getServerRepositories } from "@/server";
import { statusLabel, statusClass } from "./constants";

export default async function AdminDashboard() {
  const { projects, products, inquiries } = await getServerRepositories();
  const [allProjects, allProducts, allInquiries] = await Promise.all([
    projects.getAll(),
    products.getAll(),
    inquiries.getAll(),
  ]);

  const stats = [
    { label: "포트폴리오", count: allProjects.length },
    { label: "제품", count: allProducts.length },
    { label: "문의", count: allInquiries.length },
  ];

  const recentInquiries = allInquiries.slice(0, 5);

  return (
    <>
      <h1 className="text-navy text-2xl font-bold dark:text-white">대시보드</h1>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <li key={s.label} className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <p className="text-gray-dark text-sm dark:text-gray-400">{s.label}</p>
            <p className="text-navy mt-1 text-3xl font-bold dark:text-white">{s.count}</p>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="text-navy text-lg font-semibold dark:text-white">최근 문의</h2>
        {recentInquiries.length === 0 ? (
          <p className="text-gray-dark mt-4 dark:text-gray-400">문의가 없습니다.</p>
        ) : (
          <>
            {/* 모바일: 카드형 */}
            <ul className="mt-4 space-y-3 md:hidden">
              {recentInquiries.map((inq) => (
                <li
                  key={inq.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <p className="text-navy font-semibold dark:text-white">{inq.name}</p>
                  <p className="text-gray-dark mt-1 text-sm dark:text-gray-300">
                    {inq.type} ·{" "}
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${statusClass[inq.status] ?? ""}`}
                    >
                      {statusLabel[inq.status] ?? inq.status}
                    </span>
                  </p>
                  <p className="text-gray-dark mt-1 text-xs dark:text-gray-400">
                    {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>

            {/* 데스크톱: 테이블 */}
            <div className="mt-4 hidden md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th
                      scope="col"
                      className="text-gray-dark py-2 pr-4 font-medium dark:text-gray-300"
                    >
                      이름
                    </th>
                    <th
                      scope="col"
                      className="text-gray-dark py-2 pr-4 font-medium dark:text-gray-300"
                    >
                      유형
                    </th>
                    <th
                      scope="col"
                      className="text-gray-dark py-2 pr-4 font-medium dark:text-gray-300"
                    >
                      상태
                    </th>
                    <th scope="col" className="text-gray-dark py-2 font-medium dark:text-gray-300">
                      날짜
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="text-navy py-2 pr-4 dark:text-white">{inq.name}</td>
                      <td className="py-2 pr-4 dark:text-gray-300">{inq.type}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${statusClass[inq.status] ?? ""}`}
                        >
                          {statusLabel[inq.status] ?? inq.status}
                        </span>
                      </td>
                      <td className="py-2 dark:text-gray-300">
                        {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
