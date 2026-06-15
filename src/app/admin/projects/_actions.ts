"use server";

import { revalidatePath } from "next/cache";
import { getServerRepositories } from "@/server";
import { auth } from "@/auth";
import { projectSchema } from "@/shared/schemas";
import { uploadImages, deleteImages } from "@/server/storage-utils";
import { FORM_KEYS } from "./_constants";
import { resolvePrimaryImage } from "./_utils";
import { logError, logWarn } from "@/server/logger";
import { ROUTES } from "@/shared/routes";
import { getAiService } from "@/server/ai/factory";
import { PROJECT_STATUS } from "@/shared/constants";
import type { AiServiceParams } from "@/shared/types";

const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "images";
const STORAGE_PATH_PREFIX = "projects";

const revalidateProjects = () => {
  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.projects);
  revalidatePath(ROUTES.admin.projects);
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
      categories: formData.getAll(FORM_KEYS.categories) as string[],
      region: (formData.get(FORM_KEYS.region) as string) || null,
      building_type: (formData.get(FORM_KEYS.buildingType) as string) || null,
    });

    if (!parsed.success) {
      return { success: false as const, error: parsed.error.issues[0].message };
    }

    const { storage, projects } = await getServerRepositories();
    const imageUrls = await uploadImages(
      storage,
      formData.getAll(FORM_KEYS.images) as File[],
      STORAGE_BUCKET,
      STORAGE_PATH_PREFIX,
    );

    const primaryImageIndexStr = formData.get(FORM_KEYS.primaryImageIndex);
    const primaryImageIndex =
      primaryImageIndexStr !== null ? parseInt(String(primaryImageIndexStr), 10) : null;
    const primaryImage = resolvePrimaryImage({
      primaryImageIndex,
      existingImages: [],
      newImageUrls: imageUrls,
    });

    const result = await projects.create({
      title: parsed.data.title,
      description: parsed.data.description,
      categories: parsed.data.categories,
      region: parsed.data.region ?? null,
      building_type: parsed.data.building_type ?? null,
      images: imageUrls,
      primary_image: primaryImage,
      status: PROJECT_STATUS.ACTIVE,
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
      categories: formData.getAll(FORM_KEYS.categories),
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
      categories: formData.getAll(FORM_KEYS.categories) as string[],
      region: (formData.get(FORM_KEYS.region) as string) || null,
      building_type: (formData.get(FORM_KEYS.buildingType) as string) || null,
    });

    if (!parsed.success) {
      return { success: false as const, error: parsed.error.issues[0].message };
    }

    const { storage, projects } = await getServerRepositories();
    const project = await projects.getById(id);
    if (!project) return { success: false as const, error: "프로젝트를 찾을 수 없습니다." };

    const existingImages = formData.getAll(FORM_KEYS.existingImages) as string[];
    const newImageUrls = await uploadImages(
      storage,
      formData.getAll(FORM_KEYS.images) as File[],
      STORAGE_BUCKET,
      STORAGE_PATH_PREFIX,
    );
    const finalImages = [...existingImages, ...newImageUrls];

    const primaryImageVal = formData.get(FORM_KEYS.primaryImage);
    const primaryImageIndexStr = formData.get(FORM_KEYS.primaryImageIndex);
    const primaryImageIndex =
      primaryImageIndexStr !== null ? parseInt(String(primaryImageIndexStr), 10) : null;

    const primaryImage = resolvePrimaryImage({
      primaryImageUrl: typeof primaryImageVal === "string" ? primaryImageVal : null,
      primaryImageIndex,
      existingImages,
      newImageUrls,
    });

    const result = await projects.update(id, {
      ...parsed.data,
      images: finalImages,
      primary_image: primaryImage,
    });
    if (!result) {
      return { success: false as const, error: "수정에 실패했습니다." };
    }

    const removedImages = project.images.filter((url) => !existingImages.includes(url));
    deleteImages(storage, STORAGE_BUCKET, removedImages);

    revalidateProjects();
    return { success: true as const };
  } catch (error) {
    logError("admin.projects.updateProject", error, {
      id,
      title: formData.get(FORM_KEYS.title),
      categories: formData.getAll(FORM_KEYS.categories),
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

    revalidateProjects();
    return { success: true as const };
  } catch (error) {
    logError("admin.projects.deleteProject", error, { id });
    return { success: false as const, error: "서버 오류가 발생했습니다." };
  }
}

export async function generateAiDescription(params: AiServiceParams) {
  const aiService = getAiService();
  return aiService.generateDescription(params);
}
