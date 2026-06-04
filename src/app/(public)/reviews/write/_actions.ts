"use server";

import { revalidatePath } from "next/cache";
import { getServerRepositories } from "@/server";
import { auth } from "@/auth";
import { reviewSchema } from "@/shared/schemas";
import { uploadImages, deleteImages } from "@/server/storage-utils";
import { logError } from "@/server/logger";
import { ROUTES } from "@/shared/routes";
import { isUUIDv7Expired } from "@/shared/utils";
import { REVIEW_INVITE_MAX_AGE_MS, REVIEW_STATUS } from "@/shared/constants";
import { FORM_KEYS } from "./_constants";

const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "images";
const STORAGE_PATH_PREFIX = "reviews";

export async function submitReview(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.kakaoId) {
      return { success: false as const, error: "인증이 필요합니다." };
    }

    const content = formData.get(FORM_KEYS.content);
    const ratingRaw = formData.get(FORM_KEYS.rating);
    const parsed = reviewSchema.safeParse({
      content,
      rating: ratingRaw ? Number(ratingRaw) : 5,
    });

    if (!parsed.success) {
      return { success: false as const, error: parsed.error.issues[0].message };
    }

    const { content: validContent, rating } = parsed.data;

    const { reviews, reviewEdits, storage } = await getServerRepositories();
    const existingReview = await reviews.getById(id);

    const newFiles = formData.getAll(FORM_KEYS.images) as File[];
    const existingImageUrls = formData.getAll(FORM_KEYS.existingImages) as string[];
    const primaryImageRaw = formData.get(FORM_KEYS.primaryImage) as string | null;

    // 신규 이미지 업로드
    const newImageUrls = await uploadImages(storage, newFiles, STORAGE_BUCKET, STORAGE_PATH_PREFIX);
    const finalImageUrls = [...existingImageUrls, ...newImageUrls];

    // 사진 필수 조건 검증
    if (finalImageUrls.length === 0) {
      deleteImages(storage, STORAGE_BUCKET, newImageUrls);
      return { success: false as const, error: "최소 1장 이상의 시공 사진을 첨부해주세요." };
    }

    if (!existingReview) {
      // 1. 신규 등록: 링크 만료 검증
      if (isUUIDv7Expired(id, REVIEW_INVITE_MAX_AGE_MS)) {
        deleteImages(storage, STORAGE_BUCKET, newImageUrls);
        return { success: false as const, error: "만료된 리뷰 작성 링크입니다." };
      }

      const result = await reviews.create({
        id,
        kakao_id: session.kakaoId,
        author_name: session.user?.name ?? "고객",
        author_avatar: session.user?.image ?? "",
        content: validContent,
        images: finalImageUrls,
        primary_image: primaryImageRaw ?? finalImageUrls[0] ?? null,
        rating,
      });

      if (!result) {
        deleteImages(storage, STORAGE_BUCKET, newImageUrls);
        return { success: false as const, error: "후기 등록에 실패했습니다." };
      }
    } else {
      // 권한 검증: 로그인 유저가 작성한 글인지 체크 (상태 정보 노출 방지를 위해 먼저 검증)
      if (existingReview.kakao_id !== session.kakaoId) {
        deleteImages(storage, STORAGE_BUCKET, newImageUrls);
        return { success: false as const, error: "수정 권한이 없습니다." };
      }

      // 반려 또는 무효화된 상태인지 확인
      if (
        existingReview.status === REVIEW_STATUS.REJECTED ||
        existingReview.status === REVIEW_STATUS.DELETED
      ) {
        deleteImages(storage, STORAGE_BUCKET, newImageUrls);
        return { success: false as const, error: "이미 무효화되거나 반려된 리뷰 링크입니다." };
      }

      if (existingReview.status === REVIEW_STATUS.PENDING) {
        // 2. 대기 상태 직접 수정 (reviews 테이블 바로 업데이트)
        const result = await reviews.update(id, {
          content: validContent,
          images: finalImageUrls,
          primary_image: primaryImageRaw ?? finalImageUrls[0] ?? null,
          rating,
        });

        if (!result) {
          deleteImages(storage, STORAGE_BUCKET, newImageUrls);
          return { success: false as const, error: "후기 수정에 실패했습니다." };
        }

        // 지워진 이미지 삭제 처리
        const removedImages = existingReview.images.filter(
          (url) => !existingImageUrls.includes(url),
        );
        deleteImages(storage, STORAGE_BUCKET, removedImages);
      } else {
        // 3. 승인 상태 수정 요청 (review_edits 테이블에 upsert)
        const result = await reviewEdits.upsert({
          review_id: id,
          content: validContent,
          images: finalImageUrls,
          primary_image: primaryImageRaw ?? finalImageUrls[0] ?? null,
          rating,
        });

        if (!result) {
          deleteImages(storage, STORAGE_BUCKET, newImageUrls);
          return { success: false as const, error: "수정 요청에 실패했습니다." };
        }
      }
    }

    revalidatePath(ROUTES.home);
    revalidatePath(ROUTES.admin.reviews);
    revalidatePath(ROUTES.writeReview(id));
    revalidatePath(ROUTES.myReviews);
    return { success: true as const };
  } catch (error) {
    logError("reviews.submitReview", error, { id });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}
