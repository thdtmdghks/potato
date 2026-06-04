"use client";

import { useState } from "react";
import Image from "next/image";
import type { Review } from "@/shared/types";
import { formatDate } from "@/shared/utils";
import { Button } from "@/app/_components/button";
import { LightboxModal } from "@/app/_components/lightbox-modal";
import { ImageThumbnail } from "@/app/_components/image-thumbnail";

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
                          {formatDate(review.created_at)}
                        </span>
                        <span className="mx-1.5 text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-xs font-semibold text-amber-500">
                          ★ {review.rating}점
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                      {review.content}
                    </p>

                    {review.images.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          대표 이미지 설정 (별표 클릭 시 대표 설정 / 이미지 클릭 시 크게 보기)
                        </span>
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {review.images.map((url, idx) => (
                            <ImageThumbnail
                              key={url}
                              url={url}
                              isPrimary={currentPrimary === url}
                              onSelectPrimary={() => {
                                setSelectedPrimaries((prev) => ({
                                  ...prev,
                                  [review.id]: url,
                                }));
                              }}
                              onPreview={() => setActiveImages({ urls: review.images, index: idx })}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 버튼 제어 */}
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
