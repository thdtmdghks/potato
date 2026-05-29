"use client";

import Image from "next/image";
import type { Review } from "@/shared/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/carousel";

interface Props {
  reviews: Review[];
}

export function ReviewCarousel({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-5xl px-8">
      <Carousel opts={{ loop: false, align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="basis-full pl-4 sm:basis-1/2">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 dark:backdrop-blur-sm">
                <div className="space-y-4">
                  {/* 따옴표 장식 */}
                  <div className="text-accent font-serif text-3xl opacity-40 select-none">“</div>

                  {/* 내용 */}
                  <p className="line-clamp-4 min-h-[5rem] text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {review.content}
                  </p>

                  {/* 시공 완료 사진 */}
                  {review.images.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                      {review.images.map((url) => (
                        <div
                          key={url}
                          className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50 dark:border-gray-800"
                        >
                          <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 작성자 정보 */}
                <div className="mt-6 flex items-center gap-3 border-t border-gray-50 pt-4 dark:border-gray-800/50">
                  {review.author_avatar ? (
                    <Image
                      src={review.author_avatar}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-sm text-gray-400">👤</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {review.author_name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      시공 완료 고객 · {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 네비게이션 버튼 (데스크톱에서만 외측 노출, 모바일에서는 터치 스와이프 권장) */}
        <CarouselPrevious className="hidden md:inline-flex" />
        <CarouselNext className="hidden md:inline-flex" />
      </Carousel>
    </div>
  );
}
