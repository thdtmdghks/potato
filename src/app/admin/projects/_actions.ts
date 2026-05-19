"use server";

import { revalidatePath } from "next/cache";
import { getServerRepositories } from "@/server";
import { projectSchema } from "@/shared/schemas";
import type { StorageRepository } from "@/server/repositories";
import { FORM_KEYS } from "./_constants";

const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "images";
const STORAGE_PATH_PREFIX = "projects";

const revalidateProjects = () => {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
};

const uploadImages = async (storage: StorageRepository, files: File[]) => {
  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    const path = `${STORAGE_PATH_PREFIX}/${crypto.randomUUID()}.webp`;
    const url = await storage.upload(STORAGE_BUCKET, path, file);
    if (url) urls.push(url);
  }
  return urls;
};

const extractStoragePath = (url: string): string | null => {
  const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  return match?.[1] ?? null;
};

const deleteImages = (storage: StorageRepository, urls: string[]) => {
  for (const url of urls) {
    const path = extractStoragePath(url);
    if (path) storage.delete(STORAGE_BUCKET, path);
  }
};

export async function createProject(formData: FormData) {
  const parsed = projectSchema.safeParse({
    title: formData.get(FORM_KEYS.title),
    description: formData.get(FORM_KEYS.description),
    category: formData.get(FORM_KEYS.category),
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const { storage, projects } = await getServerRepositories();
  const imageUrls = await uploadImages(storage, formData.getAll(FORM_KEYS.images) as File[]);

  const result = await projects.create({ ...parsed.data, images: imageUrls });
  if (!result) return { success: false as const, error: "생성에 실패했습니다." };

  revalidateProjects();
  return { success: true as const };
}

export async function updateProject(id: string, formData: FormData) {
  const parsed = projectSchema.safeParse({
    title: formData.get(FORM_KEYS.title),
    description: formData.get(FORM_KEYS.description),
    category: formData.get(FORM_KEYS.category),
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const { storage, projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) return { success: false as const, error: "프로젝트를 찾을 수 없습니다." };

  const existingImages = formData.getAll(FORM_KEYS.existingImages) as string[];
  const newImageUrls = await uploadImages(storage, formData.getAll(FORM_KEYS.images) as File[]);

  const result = await projects.update(id, {
    ...parsed.data,
    images: [...existingImages, ...newImageUrls],
  });
  if (!result) return { success: false as const, error: "수정에 실패했습니다." };

  const removedImages = project.images.filter((url) => !existingImages.includes(url));
  deleteImages(storage, removedImages);

  revalidateProjects();
  return { success: true as const };
}

export async function deleteProject(id: string) {
  const { storage, projects } = await getServerRepositories();
  const project = await projects.getById(id);

  const success = await projects.delete(id);
  if (!success) return { success: false as const, error: "삭제에 실패했습니다." };

  if (project) deleteImages(storage, project.images);

  revalidateProjects();
  return { success: true as const };
}
