"use client";

import Image from "next/image";
import type { Review } from "@/shared/types";

interface Props {
  reviews: Review[];
  loadingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PendingReviewsList({ reviews, loadingId, onApprove, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
        <span>신규 등록 대기 후기</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          {reviews.length}
        </span>
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-dark py-12 text-center text-sm dark:text-gray-400">
          승인 대기 중인 신규 후기가 없습니다.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
          {reviews.map((review) => (
            <li key={review.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* 작성자 정보 및 내용 */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2.5">
                    {review.author_avatar ? (
                      <Image
                        src={review.author_avatar}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">👤</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {review.author_name}
                      </span>
                      <span className="mx-1.5 text-gray-300 dark:text-gray-700">|</span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {review.content}
                  </p>

                  {review.images.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                      {review.images.map((url) => (
                        <div
                          key={url}
                          className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50 dark:border-gray-800"
                        >
                          <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 버튼 제어 */}
                <div className="flex shrink-0 gap-2 sm:w-28 sm:flex-col">
                  <button
                    onClick={() => onApprove(review.id)}
                    disabled={loadingId !== null}
                    className="bg-navy hover:bg-navy-light flex-1 rounded-lg py-2 text-xs font-semibold text-white shadow-sm transition-colors disabled:opacity-50"
                  >
                    {loadingId === review.id ? "처리 중..." : "노출 승인"}
                  </button>
                  <button
                    onClick={() => onDelete(review.id)}
                    disabled={loadingId !== null}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
