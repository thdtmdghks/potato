"use client";

import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/shared/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/carousel";

import AutoScroll from "embla-carousel-auto-scroll";
import { formatDate } from "@/shared/utils";
import { ROUTES } from "@/shared/routes";
import { useState } from "react";
import { LightboxModal } from "@/app/_components/lightbox-modal";

interface Props {
  reviews: Review[];
}

export function ReviewCarousel({ reviews }: Props) {
  const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(
    null,
  );

  if (reviews.length === 0) return null;

  const handleImageClick = (review: Review) => {
    if (review.images.length === 0) return;
    const initialIndex = review.primary_image ? review.images.indexOf(review.primary_image) : 0;
    setLightboxState({
      images: review.images,
      index: initialIndex >= 0 ? initialIndex : 0,
    });
  };

  return (
    <div className="relative mx-auto max-w-5xl px-8">
      <Carousel
        opts={{ loop: true, align: "start", dragFree: true }}
        plugins={[AutoScroll({ speed: 1.2, stopOnInteraction: false, stopOnMouseEnter: false })]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="basis-full pl-4 sm:basis-1/2">
              <div className="relative flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:backdrop-blur-sm">
                {/* 1. 시공 완료 사진 (카드 상단 배치로 가장 크게 강조) */}
                {(review.primary_image || review.images.length > 0) && (
                  <div
                    onClick={() => handleImageClick(review)}
                    className="group relative mb-4 h-48 w-full cursor-pointer overflow-hidden rounded-xl border border-gray-50 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <Image
                      src={review.primary_image ?? review.images[0]}
                      alt="경산창호 시공 완료 사진"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {review.images.length > 1 && (
                      <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        +{review.images.length - 1}장
                      </div>
                    )}
                  </div>
                )}

                {/* 2. 후기 내용 */}
                <div className="flex-1 space-y-3">
                  {/* 만족도 별점 표시 */}
                  <div className="flex items-center gap-0.5" aria-label={`평점 ${review.rating}점`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-base ${
                          star <= review.rating
                            ? "text-amber-400"
                            : "text-gray-200 dark:text-gray-700"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <Link
                    href={ROUTES.reviewDetail(review.id)}
                    className="block transition-opacity hover:opacity-80"
                  >
                    <p className="line-clamp-4 min-h-[3rem] text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {review.content}
                    </p>
                  </Link>
                </div>

                {/* 3. 작성자 정보 및 날짜 */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 dark:border-gray-800/50">
                  <div className="flex items-center gap-2.5">
                    {review.author_avatar ? (
                      <Image
                        src={review.author_avatar}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-[10px] text-gray-400">👤</span>
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {review.author_name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{formatDate(review.created_at)}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 네비게이션 버튼 (데스크톱에서만 외측 노출, 모바일에서는 터치 스와이프 권장) */}
        <CarouselPrevious className="hidden md:inline-flex" />
        <CarouselNext className="hidden md:inline-flex" />
      </Carousel>
      {lightboxState && (
        <LightboxModal
          urls={lightboxState.images}
          initialIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
        />
      )}
    </div>
  );
}
