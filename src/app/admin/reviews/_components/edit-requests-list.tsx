"use client";

import Image from "next/image";
import type { Review, ReviewEdit } from "@/shared/types";

interface Props {
  editRequests: (ReviewEdit & { original: Review })[];
  loadingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function EditRequestsList({ editRequests, loadingId, onApprove, onReject }: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
        <span>리뷰 수정 요청 및 원본 대조</span>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
          {editRequests.length}
        </span>
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        승인되어 노출 중인 원본 내용과 새로 접수된 고객의 수정안을 비교합니다. 승인 시 원본이
        수정안으로 즉시 교체되며 노출됩니다.
      </p>

      {editRequests.length === 0 ? (
        <p className="text-gray-dark py-16 text-center text-sm dark:text-gray-400">
          수정 요청 대기 건이 없습니다.
        </p>
      ) : (
        <div className="mt-8 space-y-8 divide-y divide-gray-100 dark:divide-gray-800">
          {editRequests.map((req) => (
            <div key={req.review_id} className="space-y-4 pt-8 first:pt-0">
              {/* 작성자 공통 정보 및 동작 제어 */}
              <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-gray-800/50">
                <div className="flex items-center gap-2">
                  {req.original.author_avatar ? (
                    <Image
                      src={req.original.author_avatar}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-xs text-gray-400">👤</span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {req.original.author_name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(req.review_id)}
                    disabled={loadingId !== null}
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loadingId === req.review_id ? "처리 중..." : "수정 승인"}
                  </button>
                  <button
                    onClick={() => onReject(req.review_id)}
                    disabled={loadingId !== null}
                    className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    수정 반려
                  </button>
                </div>
              </div>

              {/* 구/신 비교 영역 */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* 기존 원본 */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/20">
                  <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    현재 노출 중인 원본
                  </p>
                  <p className="min-h-[4.5rem] text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                    {req.original.content}
                  </p>

                  {req.original.images.length > 0 && (
                    <div className="mt-4 flex gap-1.5 overflow-x-auto py-1">
                      {req.original.images.map((url) => (
                        <div
                          key={url}
                          className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100 dark:border-gray-800"
                        >
                          <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 새로운 수정안 */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 dark:border-indigo-950/20 dark:bg-indigo-950/5">
                  <p className="mb-3 text-xs font-bold tracking-wider text-indigo-500 uppercase">
                    고객 제출 수정 요청안
                  </p>
                  <p className="min-h-[4.5rem] text-sm leading-relaxed font-medium whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {req.content}
                  </p>

                  {req.images.length > 0 && (
                    <div className="mt-4 flex gap-1.5 overflow-x-auto py-1">
                      {req.images.map((url) => (
                        <div
                          key={url}
                          className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-indigo-200 bg-gray-100 dark:border-indigo-900/50"
                        >
                          <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
