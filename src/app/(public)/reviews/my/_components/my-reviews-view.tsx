import type { MyReviewsState } from "../_types";
import Link from "next/link";
import Image from "next/image";
import { EmptyReviews } from "./empty-reviews";
import { ReviewCard } from "./review-card";
import { AuthRequiredCard } from "@/app/_components/auth-required-card";
import { ROUTES } from "@/shared/routes";

interface MyReviewsViewProps {
  state: MyReviewsState;
}

export function MyReviewsView({ state }: MyReviewsViewProps) {
  if (state.type === "AUTH_REQUIRED") {
    return (
      <AuthRequiredCard
        redirectTo={state.redirectTo}
        title="마이페이지 접근 제한"
        description="고객님이 작성하신 후기 목록을 확인하고 수정하려면 카카오 로그인을 통한 본인 인증이 필요합니다."
      />
    );
  }

  const { userName, userImage, reviews } = state;

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-12 dark:bg-black">
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <Link href={ROUTES.home} className="text-navy text-sm hover:underline dark:text-blue-400">
          ← 경산창호 홈
        </Link>
        <div className="flex items-center space-x-2">
          {userImage && (
            <Image
              src={userImage}
              alt=""
              width={24}
              height={24}
              className="rounded-full bg-gray-200"
            />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {userName ?? "고객"}님 계정
          </span>
        </div>
      </div>

      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-navy text-3xl font-extrabold tracking-tight dark:text-white">
          내가 작성한 시공 후기
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          작성해주신 소중한 시공 후기의 관리 및 승인 현황입니다.
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {reviews.length === 0 ? (
          <EmptyReviews />
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </main>
  );
}
