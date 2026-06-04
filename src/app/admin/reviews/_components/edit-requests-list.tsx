"use client";

import { useState } from "react";
import type { Review, ReviewEdit } from "@/shared/types";
import { Button } from "@/app/_components/button";
import { LightboxModal } from "@/app/_components/lightbox-modal";
import { ReviewCardContent } from "./review-card-content";

interface Props {
  editRequests: (ReviewEdit & { original: Review })[];
  loadingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function EditRequestsList({ editRequests, loadingId, onApprove, onReject }: Props) {
  const [activeImages, setActiveImages] = useState<{ urls: string[]; index: number } | null>(null);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
        <span>리뷰 수정 요청 및 원본 대조</span>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
          {editRequests.length}
        </span>
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        승인 시 원본이 수정안으로 즉시 교체되며 노출됩니다.
      </p>

      {editRequests.length === 0 ? (
        <p className="text-gray-dark py-16 text-center text-sm dark:text-gray-400">
          수정 요청 대기 건이 없습니다.
        </p>
      ) : (
        <div className="mt-8 space-y-8 divide-y divide-gray-100 dark:divide-gray-800">
          {editRequests.map((req) => (
            <div key={req.review_id} className="space-y-4 pt-8 first:pt-0">
              {/* 버튼 */}
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => onApprove(req.review_id)}
                  loading={loadingId === req.review_id}
                  disabled={loadingId !== null}
                  className="border-none bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  수정 승인
                </Button>
                <Button
                  onClick={() => onReject(req.review_id)}
                  disabled={loadingId !== null}
                  variant="outline"
                  className="px-4 py-1.5 text-xs font-semibold"
                >
                  수정 반려
                </Button>
              </div>

              {/* 원본 / 수정안 대조 */}
              <div className="grid gap-4 md:grid-cols-2">
                <ReviewCardContent
                  authorName={req.original.author_name}
                  authorAvatar={req.original.author_avatar}
                  createdAt={req.original.created_at}
                  rating={req.original.rating}
                  content={req.original.content}
                  images={req.original.images}
                  primaryImage={req.original.primary_image}
                  variant="original"
                  label="🔴 현재 노출 중인 원본"
                  onPreviewImage={(urls, index) => setActiveImages({ urls, index })}
                />
                <ReviewCardContent
                  authorName={req.original.author_name}
                  authorAvatar={req.original.author_avatar}
                  createdAt={req.created_at}
                  rating={req.rating}
                  content={req.content}
                  images={req.images}
                  primaryImage={req.primary_image}
                  variant="edit"
                  label="🟢 고객 제출 수정 요청안"
                  onPreviewImage={(urls, index) => setActiveImages({ urls, index })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {activeImages && (
        <LightboxModal
          urls={activeImages.urls}
          initialIndex={activeImages.index}
          onClose={() => setActiveImages(null)}
        />
      )}
    </section>
  );
}
