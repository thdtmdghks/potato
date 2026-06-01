import type { ReviewWriteState, ReviewWriteDeps } from "./_types";
import { ROUTES } from "@/shared/routes";
import { REVIEW_INVITE_MAX_AGE_MS, REVIEW_STATUS } from "@/shared/constants";
import { isUUIDv7Expired } from "@/shared/utils";

const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 전달받은 문자열이 올바른 UUID v7 형식인지 검증합니다.
 */
export const isValidUUIDv7 = (id: string): boolean => {
  if (!id) return false;
  return UUID_V7_REGEX.test(id);
};

/**
 * 후기 작성 페이지의 비즈니스 로직 및 권한 분기 처리를 수행하고 상태를 반환합니다.
 */
export const getReviewWriteState = async (
  id: string,
  session: { kakaoId?: string; user?: { name?: string | null; image?: string | null } } | null,
  deps: ReviewWriteDeps,
): Promise<ReviewWriteState> => {
  // 1. UUID v7 규격 검증
  if (!isValidUUIDv7(id)) {
    return { type: "INVALID_LINK" };
  }

  // 2. 로그인 확인
  if (!session?.kakaoId) {
    return { type: "AUTH_REQUIRED", redirectTo: ROUTES.writeReview(id) };
  }

  // 3. DB 데이터 조회
  const existingReview = await deps.reviews.getById(id);

  let initialData: { content: string; images: string[]; rating: number } | null = null;
  let isApproved = false;

  if (existingReview) {
    // 3.1 본인 확인 (상태 정보 노출 방지를 위해 먼저 검증)
    if (existingReview.kakao_id !== session.kakaoId) {
      return { type: "UNAUTHORIZED" };
    }

    // 3.2 반려 또는 무효화된 상태인지 확인
    if (
      existingReview.status === REVIEW_STATUS.REJECTED ||
      existingReview.status === REVIEW_STATUS.DELETED
    ) {
      return {
        type: "INVALID_LINK",
        title: "사용할 수 없는 링크",
        description: "관리자에 의해 반려되었거나 이미 무효화된 후기 링크입니다.",
      };
    }

    if (existingReview.status === REVIEW_STATUS.APPROVED) {
      isApproved = true;
      const edit = await deps.reviewEdits.getById(id);
      if (edit) {
        initialData = {
          content: edit.content,
          images: edit.images,
          rating: edit.rating,
        };
      } else {
        initialData = {
          content: existingReview.content,
          images: existingReview.images,
          rating: existingReview.rating,
        };
      }
    } else {
      initialData = {
        content: existingReview.content,
        images: existingReview.images,
        rating: existingReview.rating,
      };
    }
  } else {
    // 4. 신규 작성: 링크 만료 검증 (기존 리뷰가 있는 수정 케이스에는 적용하지 않음)
    if (isUUIDv7Expired(id, REVIEW_INVITE_MAX_AGE_MS)) {
      return {
        type: "INVALID_LINK",
        title: "만료된 링크",
        description: "해당 리뷰 작성 링크의 유효 기간(1주일)이 만료되었습니다.",
      };
    }
  }

  return {
    type: "READY",
    id,
    initialData,
    isApproved,
    userProfile: {
      name: session.user?.name,
      image: session.user?.image,
    },
  };
};
