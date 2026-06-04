"use client";

import { useState } from "react";
import type { Review } from "@/shared/types";
import { Button } from "@/app/_components/button";
import { LightboxModal } from "@/app/_components/lightbox-modal";
import { ReviewCardContent } from "./review-card-content";

interface Props {
  reviews: Review[];
  loadingId: string | null;
  onApprove: (id: string, primaryImage: string | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PendingReviewsList({ reviews, loadingId, onApprove, onDelete }: Props) {
  const [selectedPrimaries, setSelectedPrimaries] = useState<Record<string, string | null>>({});
  const [activeImages, setActiveImages] = useState<{ urls: string[]; index: number } | null>(null);
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
          {reviews.map((review) => {
            const currentPrimary =
              selectedPrimaries[review.id] !== undefined
                ? selectedPrimaries[review.id]
                : (review.images[0] ?? null);

            return (
              <li key={review.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <ReviewCardContent
                      authorName={review.author_name}
                      authorAvatar={review.author_avatar}
                      createdAt={review.created_at}
                      rating={review.rating}
                      content={review.content}
                      images={review.images}
                      primaryImage={currentPrimary}
                      onSelectPrimary={(url) =>
                        setSelectedPrimaries((prev) => ({ ...prev, [review.id]: url }))
                      }
                      onPreviewImage={(urls, index) => setActiveImages({ urls, index })}
                    />
                  </div>

                  <div className="flex shrink-0 gap-2 sm:w-28 sm:flex-col">
                    <Button
                      onClick={() => onApprove(review.id, currentPrimary)}
                      loading={loadingId === review.id}
                      disabled={loadingId !== null}
                      className="bg-navy hover:bg-navy-light flex-1 border-none py-2 text-xs font-semibold text-white shadow-sm"
                    >
                      노출 승인
                    </Button>
                    <Button
                      onClick={() => onDelete(review.id)}
                      disabled={loadingId !== null}
                      variant="outline"
                      className="flex-1 py-2 text-xs font-semibold"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {activeImages && (
        <LightboxModal
          urls={activeImages.urls}
          initialIndex={activeImages.index}
          onClose={() => setActiveImages(null)}
        />
      )}
    </div>
  );
}
