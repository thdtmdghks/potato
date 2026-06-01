"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/shared/types";
import { projectSchema, type ProjectFormData } from "@/shared/schemas";
import { useImageUpload } from "@/client/use-image-upload";
import { Input } from "@/app/_components/input";
import { Textarea } from "@/app/_components/textarea";
import { Label } from "@/app/_components/label";
import { ImageUpload } from "@/app/_components/image-upload";
import { createProject, updateProject } from "../_actions";
import { FORM_KEYS } from "../_constants";
import { CATEGORIES } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";

interface Props {
  project?: Project;
}

export function ProjectForm({ project }: Props) {
  const isEdit = !!project;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      category: project?.category ?? "",
    },
  });

  const [serverError, setServerError] = useState("");

  const {
    existingImages,
    compressedFiles,
    previews,
    compressing,
    handleFiles,
    removeExisting,
    removeNew,
  } = useImageUpload({
    initialImages: project?.images ?? [],
    maxCount: 20,
    onError: (msg) => setServerError(msg),
  });

  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(
    project?.primary_image ?? project?.images[0] ?? null,
  );

  const primaryImageUrl = useMemo(() => {
    const allImages = [...existingImages, ...previews];
    if (allImages.length === 0) return null;
    if (selectedPrimary && allImages.includes(selectedPrimary)) return selectedPrimary;
    return allImages[0];
  }, [existingImages, previews, selectedPrimary]);

  const onSubmit = async (data: ProjectFormData) => {
    setServerError("");
    const fd = new FormData();
    fd.set(FORM_KEYS.title, data.title);
    fd.set(FORM_KEYS.description, data.description);
    fd.set(FORM_KEYS.category, data.category);

    for (const file of compressedFiles) {
      fd.append(FORM_KEYS.images, file);
    }
    for (const url of existingImages) {
      fd.append(FORM_KEYS.existingImages, url);
    }

    if (primaryImageUrl) {
      if (existingImages.includes(primaryImageUrl)) {
        fd.set(FORM_KEYS.primaryImage, primaryImageUrl);
      } else {
        const idx = previews.indexOf(primaryImageUrl);
        if (idx !== -1) {
          fd.set(FORM_KEYS.primaryImageIndex, String(idx));
        }
      }
    }

    const result = isEdit ? await updateProject(project.id, fd) : await createProject(fd);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(ROUTES.admin.projects);
  };

  return (
    <>
      <Link href={ROUTES.admin.projects} className="text-navy hover:underline dark:text-blue-400">
        ← 목록으로
      </Link>
      <h1 className="text-navy mt-4 text-2xl font-bold dark:text-white">
        {isEdit ? "시공사례 수정" : "새 시공사례"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-xl space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            {...register("title")}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">카테고리</Label>
          <select
            id="category"
            {...register("category")}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            <option value="">선택해주세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={4}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <ImageUpload
          label="사진"
          description="WebP로 자동 변환, 최대 200KB. 이미지 클릭 시 대표사진으로 설정됩니다."
          existingImages={existingImages}
          previews={previews}
          compressing={compressing}
          maxCount={20}
          onFilesChange={handleFiles}
          onRemoveExisting={removeExisting}
          onRemoveNew={removeNew}
          primaryImageUrl={primaryImageUrl}
          onSelectPrimary={(url) => setSelectedPrimary(url)}
        />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting || compressing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2 disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>
    </>
  );
}
