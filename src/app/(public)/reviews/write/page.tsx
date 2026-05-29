import type { Metadata } from "next";
import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { getReviewWriteState } from "./_utils";
import { ReviewWriteView } from "./_components/review-write-view";

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
  const session = await auth();

  const { reviews, reviewEdits } = await getServerRepositories();

  const state = await getReviewWriteState(id, session, { reviews, reviewEdits });

  return <ReviewWriteView state={state} />;
}
