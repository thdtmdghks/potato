import { Suspense } from "react";
import type { Metadata } from "next";
import { getReviewDetailMetadata, getAllReviewParams } from "./_utils";
import { ReviewDetailContent } from "./_components/review-detail-content";
import { ReviewDetailSkeleton } from "./_components/review-detail-skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllReviewParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return getReviewDetailMetadata(id);
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<ReviewDetailSkeleton />}>
      <ReviewDetailContent id={id} />
    </Suspense>
  );
}
