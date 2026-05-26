"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/shared/types";
import { projectSchema, type ProjectFormData } from "@/shared/schemas";
import { compressImage } from "@/client/image";
import { Input } from "@/app/_components/input";
import { Textarea } from "@/app/_components/textarea";
import { Label } from "@/app/_components/label";
import { ImageThumbnail } from "@/app/_components/image-thumbnail";
import { createProject, updateProject } from "../_actions";
import { FORM_KEYS } from "../_constants";
import { CATEGORIES } from "@/shared/constants";

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

  const [existingImages, setExistingImages] = useState<string[]>(project?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [serverError, setServerError] = useState("");

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

    const result = isEdit ? await updateProject(project.id, fd) : await createProject(fd);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push("/admin/projects");
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setCompressing(true);
    const compressed: File[] = [];
    const urls: string[] = [];

    for (const file of files) {
      try {
        const result = await compressImage(file);
        compressed.push(result);
        urls.push(URL.createObjectURL(result));
      } catch {
        setServerError(`"${file.name}" 압축에 실패했습니다. 다른 이미지를 사용해주세요.`);
      }
    }

    setCompressedFiles((prev) => [...prev, ...compressed]);
    setPreviews((prev) => [...prev, ...urls]);
    setCompressing(false);
    e.target.value = "";
  };

  const removeExisting = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setCompressedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Link href="/admin/projects" className="text-navy hover:underline dark:text-blue-400">
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

        <div>
          <span className="text-sm font-medium">사진</span>

          {existingImages.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {existingImages.map((url, idx) => (
                <ImageThumbnail key={url} url={url} onRemove={() => removeExisting(idx)} />
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {previews.map((url, idx) => (
                <ImageThumbnail key={url} url={url} onRemove={() => removeNew(idx)} />
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="text-muted-foreground file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 mt-1.5 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm"
          />
          {compressing && <p className="text-muted-foreground mt-1 text-xs">이미지 압축 중...</p>}
          <p className="text-muted-foreground mt-1 text-xs">WebP로 자동 변환, 최대 200KB</p>
        </div>

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
