import Link from "next/link";
import { getServerRepositories } from "@/server";

const statusLabel: Record<string, string> = {
  pending: "대기",
  confirmed: "확인",
  completed: "완료",
};

const statusClass: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export default async function AdminInquiries({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { inquiries } = await getServerRepositories();
  const items = await inquiries.getAll(status);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy dark:text-white">문의 관리</h1>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="상태 필터">
        {[
          { href: "/admin/inquiries", label: "전체", active: !status },
          { href: "/admin/inquiries?status=pending", label: "대기", active: status === "pending" },
          { href: "/admin/inquiries?status=confirmed", label: "확인", active: status === "confirmed" },
          { href: "/admin/inquiries?status=completed", label: "완료", active: status === "completed" },
        ].map((f) => (
          <Link key={f.label} href={f.href} className={`shrink-0 rounded px-3 py-2 text-sm ${f.active ? "bg-navy text-white" : "bg-gray-light text-gray-dark dark:bg-gray-800 dark:text-gray-300"}`}>
            {f.label}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-dark dark:text-gray-400">문의가 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((inq) => (
            <li key={inq.id}>
              <Link href={`/admin/inquiries/${inq.id}`} className="block rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-navy dark:text-white">{inq.name}</p>
                  <span className={`rounded px-2 py-0.5 text-xs ${statusClass[inq.status] ?? ""}`}>
                    {statusLabel[inq.status] ?? inq.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-dark dark:text-gray-300">{inq.type} · {inq.phone}</p>
                <p className="mt-1 line-clamp-1 text-sm text-gray-dark dark:text-gray-400">{inq.content}</p>
                <p className="mt-1 text-xs text-gray-dark dark:text-gray-500">{new Date(inq.created_at).toLocaleDateString("ko-KR")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
