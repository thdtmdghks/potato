"use server";

import { revalidatePath } from "next/cache";
import { getServerRepositories } from "@/server";
import { auth } from "@/auth";
import { logWarn, logError } from "@/server/logger";
import { ROUTES } from "@/shared/routes";
import { REVIEW_STATUS } from "@/shared/constants";

const verifyAdmin = async () => {
  const session = await auth();
  if (session?.role !== "admin") {
    logWarn("admin.reviews.actions", "관리자 권한 없는 사용자의 승인/삭제 시도", {
      kakaoId: session?.kakaoId,
    });
    throw new Error("관리자 권한이 필요합니다.");
  }
};

export async function approveReview(id: string, primaryImage: string | null) {
  try {
    await verifyAdmin();
    const { reviews } = await getServerRepositories();
    const result = await reviews.update(id, {
      status: REVIEW_STATUS.APPROVED,
      primary_image: primaryImage,
    });
    if (!result) {
      return { success: false as const, error: "승인 처리에 실패했습니다." };
    }
    revalidatePath(ROUTES.home);
    revalidatePath(ROUTES.admin.reviews);
    return { success: true as const };
  } catch (error) {
    logError("admin.reviews.approveReview", error, { id });
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return { success: false as const, error: message };
  }
}

export async function deleteReview(id: string) {
  try {
    await verifyAdmin();
    const { reviews } = await getServerRepositories();
    const result = await reviews.update(id, { status: REVIEW_STATUS.DELETED });
    if (!result) {
      return { success: false as const, error: "삭제 처리에 실패했습니다." };
    }
    revalidatePath(ROUTES.home);
    revalidatePath(ROUTES.admin.reviews);
    return { success: true as const };
  } catch (error) {
    logError("admin.reviews.deleteReview", error, { id });
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return { success: false as const, error: message };
  }
}

export async function approveReviewEdit(reviewId: string) {
  try {
    await verifyAdmin();
    const { reviews, reviewEdits } = await getServerRepositories();
    const edit = await reviewEdits.getById(reviewId);
    if (!edit) {
      return { success: false as const, error: "수정 대기 항목을 찾을 수 없습니다." };
    }

    const review = await reviews.getById(reviewId);
    const originalPrimary = review?.primary_image ?? null;
    let newPrimary = originalPrimary;
    if (!edit.images || edit.images.length === 0) {
      newPrimary = null;
    } else if (!originalPrimary || !edit.images.includes(originalPrimary)) {
      newPrimary = edit.images[0];
    }

    // 원본 리뷰 업데이트
    const result = await reviews.update(reviewId, {
      content: edit.content,
      images: edit.images,
      rating: edit.rating,
      primary_image: newPrimary,
      status: REVIEW_STATUS.APPROVED,
    });

    if (!result) {
      return { success: false as const, error: "수정 승인 처리에 실패했습니다." };
    }

    // [주의] 분산 데이터 업데이트로 엄격한 DB 트랜잭션이 보장되지 않는 한계가 있으나,
    // update 성공 후 delete가 실패할 확률은 극히 낮으므로 우선 승인 후 후속 삭제를 실행합니다.
    await reviewEdits.delete(reviewId);

    revalidatePath(ROUTES.home);
    revalidatePath(ROUTES.admin.reviews);
    return { success: true as const };
  } catch (error) {
    logError("admin.reviews.approveReviewEdit", error, { reviewId });
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return { success: false as const, error: message };
  }
}

export async function rejectReviewEdit(reviewId: string) {
  try {
    await verifyAdmin();
    const { reviewEdits } = await getServerRepositories();
    const result = await reviewEdits.delete(reviewId);
    if (!result) {
      return { success: false as const, error: "수정 반려 처리에 실패했습니다." };
    }
    revalidatePath(ROUTES.admin.reviews);
    return { success: true as const };
  } catch (error) {
    logError("admin.reviews.rejectReviewEdit", error, { reviewId });
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return { success: false as const, error: message };
  }
}
