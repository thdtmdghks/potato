import type { Metadata } from "next";
import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { ReviewForm } from "./_components/review-form";
import { InvalidLinkCard } from "./_components/invalid-link-card";
import { AuthRequiredCard } from "./_components/auth-required-card";
import { UnauthorizedCard } from "./_components/unauthorized-card";
import Link from "next/link";

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function ReviewWritePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const id = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : "";

  // 1. UUID 검증
  if (!id || !UUID_REGEX.test(id)) {
    return <InvalidLinkCard />;
  }

  // 2. 로그인 확인
  const session = await auth();
  if (!session?.kakaoId) {
    return <AuthRequiredCard id={id} />;
  }

  // 3. DB 데이터 조회
  const { reviews, reviewEdits } = await getServerRepositories();
  const existingReview = await reviews.getById(id);

  let initialData: { rating: number; content: string; images: string[] } | null = null;
  let isApproved = false;

  if (existingReview) {
    // 본인 확인
    if (existingReview.kakao_id !== session.kakaoId) {
      return <UnauthorizedCard />;
    }

    if (existingReview.status === "approved") {
      isApproved = true;
      const edit = await reviewEdits.getById(id);
      if (edit) {
        initialData = {
          rating: edit.rating,
          content: edit.content,
          images: edit.images,
        };
      } else {
        initialData = {
          rating: existingReview.rating,
          content: existingReview.content,
          images: existingReview.images,
        };
      }
    } else {
      initialData = {
        rating: existingReview.rating,
        content: existingReview.content,
        images: existingReview.images,
      };
    }
  }

  const userProfile = {
    name: session.user?.name,
    image: session.user?.image,
  };

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-12 dark:bg-black">
      <div className="mx-auto mb-6 flex max-w-xl items-center justify-between">
        <Link href="/" className="text-navy text-sm hover:underline dark:text-blue-400">
          ← 경산창호 홈
        </Link>
        {existingReview && (
          <Link href="/reviews/my" className="text-navy text-sm hover:underline dark:text-blue-400">
            내 후기 목록 →
          </Link>
        )}
      </div>

      <div className="mx-auto mb-8 max-w-xl text-center">
        <h1 className="text-navy text-3xl font-extrabold tracking-tight dark:text-white">
          {existingReview ? "시공 후기 수정" : "시공 후기 작성"}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          고객님의 소중한 후기가 경산창호에 큰 힘이 됩니다.
        </p>
      </div>

      <ReviewForm
        id={id}
        initialData={initialData}
        isApproved={isApproved}
        userProfile={userProfile}
      />
    </main>
  );
}
