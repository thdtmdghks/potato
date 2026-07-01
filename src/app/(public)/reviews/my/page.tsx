import { Suspense } from "react";
import type { Metadata } from "next";
import { MyReviewsContent } from "./_components/my-reviews-content";
import { MyReviewsSkeleton } from "./_components/my-reviews-skeleton";

export const metadata: Metadata = {
  title: "내가 작성한 후기 | 경산창호",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyReviewsPage() {
  return (
    <Suspense fallback={<MyReviewsSkeleton />}>
      <MyReviewsContent />
    </Suspense>
  );
}
