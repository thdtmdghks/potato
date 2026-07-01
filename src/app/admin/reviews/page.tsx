import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminReviewsContent } from "./_components/admin-reviews-content";
import { AdminReviewsSkeleton } from "./_components/admin-reviews-skeleton";

export const metadata: Metadata = {
  title: "리뷰 관리 | 경산창호 관리자",
};

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<AdminReviewsSkeleton />}>
      <AdminReviewsContent />
    </Suspense>
  );
}
