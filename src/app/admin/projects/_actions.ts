"use server";

import { revalidatePath } from "next/cache";
import { getServerRepositories } from "@/server";
import { auth } from "@/auth";
import { projectSchema } from "@/shared/schemas";
import type { StorageRepository } from "@/server/repositories";
import { FORM_KEYS } from "./_constants";
import { logError, logWarn } from "@/server/logger";
import { ROUTES } from "@/shared/routes";

const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "images";
const STORAGE_PATH_PREFIX = "projects";

const revalidateProjects = () => {
  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.projects);
  revalidatePath(ROUTES.admin.projects);
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
  try {
    const session = await auth();
    if (!session?.kakaoId) {
      logWarn("admin.projects.createProject", "비인증 사용자의 프로젝트 생성 시도");
      return { success: false as const, error: "인증이 필요합니다." };
    }

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

    const primaryImageIndexStr = formData.get(FORM_KEYS.primaryImageIndex);
    const primaryImageIndex =
      primaryImageIndexStr !== null ? parseInt(String(primaryImageIndexStr), 10) : null;
    let primaryImage: string | null = null;
    if (primaryImageIndex !== null && imageUrls[primaryImageIndex]) {
      primaryImage = imageUrls[primaryImageIndex];
    } else if (imageUrls.length > 0) {
      primaryImage = imageUrls[0];
    }

    const result = await projects.create({
      ...parsed.data,
      images: imageUrls,
      primary_image: primaryImage,
      created_by: session.kakaoId,
    });
    if (!result) {
      return { success: false as const, error: "생성에 실패했습니다." };
    }

    revalidateProjects();
    return { success: true as const };
  } catch (error) {
    logError("admin.projects.createProject", error, {
      title: formData.get(FORM_KEYS.title),
      category: formData.get(FORM_KEYS.category),
    });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.kakaoId) {
      logWarn("admin.projects.updateProject", "비인증 사용자의 프로젝트 수정 시도", { id });
      return { success: false as const, error: "인증이 필요합니다." };
    }

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
    const finalImages = [...existingImages, ...newImageUrls];

    const primaryImageVal = formData.get(FORM_KEYS.primaryImage);
    const primaryImageIndexStr = formData.get(FORM_KEYS.primaryImageIndex);
    const primaryImageIndex =
      primaryImageIndexStr !== null ? parseInt(String(primaryImageIndexStr), 10) : null;

    let primaryImage: string | null = null;
    if (
      primaryImageVal &&
      typeof primaryImageVal === "string" &&
      finalImages.includes(primaryImageVal)
    ) {
      primaryImage = primaryImageVal;
    } else if (primaryImageIndex !== null && newImageUrls[primaryImageIndex]) {
      primaryImage = newImageUrls[primaryImageIndex];
    } else if (finalImages.length > 0) {
      primaryImage = finalImages[0];
    }

    const result = await projects.update(id, {
      ...parsed.data,
      images: finalImages,
      primary_image: primaryImage,
    });
    if (!result) {
      return { success: false as const, error: "수정에 실패했습니다." };
    }

    const removedImages = project.images.filter((url) => !existingImages.includes(url));
    deleteImages(storage, removedImages);

    revalidateProjects();
    return { success: true as const };
  } catch (error) {
    logError("admin.projects.updateProject", error, {
      id,
      title: formData.get(FORM_KEYS.title),
      category: formData.get(FORM_KEYS.category),
    });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session?.kakaoId) {
      logWarn("admin.projects.deleteProject", "비인증 사용자의 프로젝트 삭제 시도", { id });
      return { success: false as const, error: "인증이 필요합니다." };
    }

    const { storage, projects } = await getServerRepositories();
    const project = await projects.getById(id);

    const success = await projects.delete(id);
    if (!success) {
      return { success: false as const, error: "삭제에 실패했습니다." };
    }

    if (project) deleteImages(storage, project.images);

    revalidateProjects();
    return { success: true as const };
  } catch (error) {
    logError("admin.projects.deleteProject", error, { id });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}
