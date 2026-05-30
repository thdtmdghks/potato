import type { ReviewWriteState, ReviewWriteDeps } from "./_types";
import { ROUTES } from "@/shared/routes";
import { REVIEW_INVITE_MAX_AGE_MS } from "@/shared/constants";
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

  // 1.1 시간 초과(만료) 검증 (1주일)
  if (isUUIDv7Expired(id, REVIEW_INVITE_MAX_AGE_MS)) {
    return {
      type: "INVALID_LINK",
      title: "만료된 링크",
      description: "해당 리뷰 작성 링크의 유효 기간(1주일)이 만료되었습니다.",
    };
  }

  // 2. 로그인 확인
  if (!session?.kakaoId) {
    return { type: "AUTH_REQUIRED", redirectTo: ROUTES.writeReview(id) };
  }

  // 3. DB 데이터 조회
  const existingReview = await deps.reviews.getById(id);

  let initialData: { content: string; images: string[] } | null = null;
  let isApproved = false;

  if (existingReview) {
    // 3.1 반려 또는 무효화된 상태인지 확인
    if (existingReview.status === "rejected" || existingReview.status === "deleted") {
      return {
        type: "INVALID_LINK",
        title: "사용할 수 없는 링크",
        description: "관리자에 의해 반려되었거나 이미 무효화된 후기 링크입니다.",
      };
    }

    // 본인 확인
    if (existingReview.kakao_id !== session.kakaoId) {
      return { type: "UNAUTHORIZED" };
    }

    if (existingReview.status === "approved") {
      isApproved = true;
      const edit = await deps.reviewEdits.getById(id);
      if (edit) {
        initialData = {
          content: edit.content,
          images: edit.images,
        };
      } else {
        initialData = {
          content: existingReview.content,
          images: existingReview.images,
        };
      }
    } else {
      initialData = {
        content: existingReview.content,
        images: existingReview.images,
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
