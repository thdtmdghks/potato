"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "@/shared/schemas";
import { Button } from "@/app/_components/button";
import { Label } from "@/app/_components/label";
import { Textarea } from "@/app/_components/textarea";
import { submitReview } from "../_actions";
import { FORM_KEYS } from "../_constants";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/routes";
import { ReviewAvatar } from "./review-avatar";
import { ImageUpload } from "@/app/_components/image-upload";
import { useImageUpload } from "@/client/use-image-upload";

interface ReviewFormProps {
  id: string;
  initialData: {
    content: string;
    images: string[];
    rating: number;
  } | null;
  isApproved: boolean;
  userProfile: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export function ReviewForm({ id, initialData, isApproved, userProfile }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // 커스텀 훅을 사용하여 이미지 업로드 상태 및 압축 로직을 관리
  const {
    existingImages,
    compressedFiles,
    previews,
    compressing,
    handleFiles,
    removeExisting,
    removeNew,
  } = useImageUpload({
    initialImages: initialData?.images ?? [],
    maxCount: 5,
    onError: (msg) => setServerError(msg),
  });

  // react-hook-form 세팅
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: initialData?.content ?? "",
      rating: initialData?.rating ?? 5,
    },
  });

  const rating = useWatch({ control, name: "rating" });

  const onSubmit = async (data: ReviewFormData) => {
    setServerError(null);

    // 사진 필수 조건 검증
    if (existingImages.length === 0 && compressedFiles.length === 0) {
      setServerError("최소 1장 이상의 시공 사진을 첨부해주세요.");
      return;
    }

    const fd = new FormData();
    fd.set(FORM_KEYS.content, data.content);
    fd.set(FORM_KEYS.rating, String(data.rating));

    for (const file of compressedFiles) {
      fd.append(FORM_KEYS.images, file);
    }
    for (const url of existingImages) {
      fd.append(FORM_KEYS.existingImages, url);
    }

    startTransition(async () => {
      const result = await submitReview(id, fd);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      router.push(ROUTES.myReviews);
    });
  };

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {isApproved && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <p className="mb-1 font-semibold">📢 이미 홈페이지에 공개 중인 후기입니다.</p>
          <p>
            수정하신 후기는 즉시 반영되지 않으며, 관리자(대표님)의 승인을 거쳐 홈페이지에
            업데이트됩니다. 승인 전까지는 기존 후기가 유지됩니다.
          </p>
        </div>
      )}

      {/* 작성자 정보 카드 */}
      <ReviewAvatar name={userProfile?.name} image={userProfile?.image} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 만족도 별점 선택 */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
            만족도 별점 <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue("rating", star)}
                className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                  star <= rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"
                }`}
                aria-label={`별점 ${star}점 설정`}
              >
                ★
              </button>
            ))}
            <span className="ml-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400">
              {rating}점 (
              {rating === 5
                ? "매우 만족"
                : rating === 4
                  ? "만족"
                  : rating === 3
                    ? "보통"
                    : rating === 2
                      ? "불만족"
                      : "매우 불만족"}
              )
            </span>
          </div>
        </div>

        {/* 후기 내용 작성 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="content"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              상세한 후기 작성 <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs text-gray-400 dark:text-gray-500">최소 5자 이상</span>
          </div>
          <Textarea
            id="content"
            placeholder="창호 시공 후 단열이나 방음 효과, 시공 퀄리티 등에 대해 자세하게 공유해주세요! 다른 고객들에게 큰 도움이 됩니다."
            className="focus:ring-accent min-h-[160px] resize-none"
            {...register("content")}
            aria-describedby={errors.content ? "content-error" : undefined}
          />
          {errors.content && (
            <p id="content-error" className="mt-1 text-sm text-red-500">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 이미지 첨부 영역 */}
        <ImageUpload
          required
          label="시공 전/후 사진 첨부"
          description="실제 시공 사진을 최소 1장 이상 최대 5장까지 올려주세요. 업로드 시 자동으로 변환/압축됩니다."
          existingImages={existingImages}
          previews={previews}
          compressing={compressing}
          maxCount={5}
          onFilesChange={handleFiles}
          onRemoveExisting={removeExisting}
          onRemoveNew={removeNew}
        />

        {serverError && (
          <p className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm font-semibold text-red-500 dark:border-red-900/30 dark:bg-red-950/20">
            ⚠ {serverError}
          </p>
        )}

        <Button
          type="submit"
          className="bg-navy hover:bg-navy/90 h-11 w-full text-base font-semibold text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isPending || compressing}
        >
          {isPending ? "저장 중..." : initialData ? "후기 수정 완료" : "후기 등록하기"}
        </Button>
      </form>
    </div>
  );
}
