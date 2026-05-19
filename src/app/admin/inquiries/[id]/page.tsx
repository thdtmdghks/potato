import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { StatusButtons } from "./status-buttons";
import { statusLabel } from "../../constants";

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { inquiries } = await getServerRepositories();
  const inq = await inquiries.getById(id);
  if (!inq) notFound();

  return (
    <>
      <Link href="/admin/inquiries" className="text-navy hover:underline dark:text-blue-400">
        ← 목록으로
      </Link>
      <h1 className="text-navy mt-4 text-2xl font-bold dark:text-white">문의 상세</h1>

      <dl className="mt-6 space-y-3">
        {[
          { label: "이름", value: inq.name },
          { label: "연락처", value: inq.phone },
          { label: "이메일", value: inq.email ?? "—" },
          { label: "유형", value: inq.type },
          { label: "주소", value: inq.address },
          { label: "상태", value: statusLabel[inq.status] ?? inq.status },
          { label: "접수일", value: new Date(inq.created_at).toLocaleDateString("ko-KR") },
        ].map((item) => (
          <div key={item.label} className="flex gap-4">
            <dt className="text-navy w-16 shrink-0 text-sm font-medium dark:text-gray-200">
              {item.label}
            </dt>
            <dd className="text-gray-dark text-sm dark:text-gray-300">{item.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-6">
        <h2 className="text-navy text-sm font-medium dark:text-gray-200">문의 내용</h2>
        <p className="bg-gray-light text-gray-dark mt-2 rounded-lg p-4 text-sm whitespace-pre-wrap dark:bg-gray-800 dark:text-gray-300">
          {inq.content}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-navy mb-2 text-sm font-medium dark:text-gray-200">상태 변경</h2>
        <StatusButtons currentStatus={inq.status} inquiryId={inq.id} />
      </section>
    </>
  );
}
