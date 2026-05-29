import type { ReviewWriteState, ReviewWriteDeps } from "./_types";
import { ROUTES } from "@/shared/routes";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 전달받은 문자열이 올바른 UUID v4 형식인지 검증합니다.
 */
export function isValidUUID(id: string): boolean {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

/**
 * 후기 작성 페이지의 비즈니스 로직 및 권한 분기 처리를 수행하고 상태를 반환합니다.
 */
export async function getReviewWriteState(
  id: string,
  session: { kakaoId?: string; user?: { name?: string | null; image?: string | null } } | null,
  deps: ReviewWriteDeps,
): Promise<ReviewWriteState> {
  // 1. UUID 검증
  if (!isValidUUID(id)) {
    return { type: "INVALID_LINK" };
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
}
