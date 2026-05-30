import type { Metadata } from "next";
import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { getReviewWriteState, isValidUUIDv7 } from "./_utils";
import { ReviewWriteView } from "./_components/review-write-view";
import { ROUTES } from "@/shared/routes";

// 검색 엔진 색인 차단
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

  const session = await auth();
  if (!session?.kakaoId) {
    return (
      <ReviewWriteView state={{ type: "AUTH_REQUIRED", redirectTo: ROUTES.writeReview(id) }} />
    );
  }

  const { reviews, reviewEdits } = await getServerRepositories();

  const state = await getReviewWriteState(id, session, { reviews, reviewEdits });

  return <ReviewWriteView state={state} />;
}
