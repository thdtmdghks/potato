import type { MyReviewsState, MyReviewsDeps } from "./_types";
import { ROUTES } from "@/shared/routes";

/**
 * 내가 작성한 후기 목록 페이지의 비즈니스 로직 및 권한 분기 처리를 수행하고 상태를 반환합니다.
 */
export async function getMyReviewsState(
  session: { kakaoId?: string; user?: { name?: string | null; image?: string | null } } | null,
  deps: MyReviewsDeps,
): Promise<MyReviewsState> {
  if (!session?.kakaoId) {
    return { type: "AUTH_REQUIRED", redirectTo: ROUTES.myReviews };
  }

  const userReviews = await deps.reviews.getByKakaoId(session.kakaoId);

  const reviewsWithEdits = await Promise.all(
    userReviews.map(async (review) => {
      const edit = await deps.reviewEdits.getById(review.id);
      return {
        ...review,
        hasPendingEdit: !!edit,
      };
    }),
  );

  return {
    type: "READY",
    userName: session.user?.name,
    userImage: session.user?.image,
    reviews: reviewsWithEdits,
  };
}
