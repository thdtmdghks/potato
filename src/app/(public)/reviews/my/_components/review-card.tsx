import type { Review } from "@/shared/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/_components/button";
import { ROUTES } from "@/shared/routes";

interface ReviewCardProps {
  review: Review & { hasPendingEdit: boolean };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const dateStr = new Date(review.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* 카드 상단 헤더 (상태 배지) */}
      <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4 dark:border-gray-800">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
          작성일: {dateStr}
        </span>

        {/* 상태 배지 분기 */}
        {review.status === "pending" ? (
          <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
            ⌛ 검토 대기 중
          </span>
        ) : review.hasPendingEdit ? (
          <span className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-400">
            🔄 수정 승인 대기 중
          </span>
        ) : (
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            ✅ 홈페이지 공개 중
          </span>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="space-y-4 p-6">
        {/* 시공 사진 */}
        {review.images.length > 0 && (
          <div className="scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 flex gap-2 overflow-x-auto pb-1">
            {review.images.map((url) => (
              <div
                key={url}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-gray-100"
              >
                <Image src={url} alt="" fill sizes="112px" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* 후기 내용 */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
          {review.content}
        </p>
      </div>

      {/* 카드 푸터 (수정 버튼) */}
      <div className="flex justify-end border-t border-gray-50 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
        <Link href={ROUTES.writeReview(review.id)}>
          <Button className="bg-navy hover:bg-navy/90 h-8 px-4 text-xs font-semibold text-white dark:bg-blue-600 dark:hover:bg-blue-700">
            {review.status === "approved" ? "후기 수정 요청" : "후기 수정하기"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
