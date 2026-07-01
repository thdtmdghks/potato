import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/shared/constants";
import { ReviewList } from "./_components/review-list";
import { ReviewListSkeleton } from "./_components/review-list-skeleton";

export const metadata: Metadata = {
  title: "고객 시공 후기 | 경산창호",
  description:
    "경산 대구 샤시 샷시 시공을 진행한 고객님들의 솔직한 후기. 경산창호의 꼼꼼한 당일 시공 만족도를 직접 확인하세요.",
  alternates: {
    canonical: `${SITE_URL}/reviews`,
  },
};

export default function ReviewsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-navy text-3xl font-bold dark:text-white">고객 시공 후기</h1>
      <p className="text-gray-dark mt-2 text-sm dark:text-gray-400">
        경산창호에서 시공을 받으신 고객님들의 생생한 후기입니다.
      </p>

      <Suspense fallback={<ReviewListSkeleton />}>
        <ReviewList />
      </Suspense>
    </main>
  );
}
