import { Suspense } from "react";
import type { Metadata } from "next";
import { isValidUUIDv7 } from "./_utils";
import { ReviewWriteView } from "./_components/review-write-view";
import { ReviewWriteContent } from "./_components/review-write-content";
import { ReviewWriteSkeleton } from "./_components/review-write-skeleton";

export const metadata: Metadata = {
  title: "고객 후기 작성 | 경산창호",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReviewWritePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const id = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : "";

  if (!isValidUUIDv7(id)) {
    return <ReviewWriteView state={{ type: "INVALID_LINK" }} />;
  }

  return (
    <Suspense fallback={<ReviewWriteSkeleton />}>
      <ReviewWriteContent id={id} />
    </Suspense>
  );
}
