import type { Metadata } from "next";
import { cache } from "react";
import { getServerRepositories } from "@/server";
import { BUSINESS, SITE_URL } from "@/shared/constants";
import type { Project } from "@/shared/types";

export const getProject = cache(async (id: string): Promise<Project | null> => {
  const { projects } = await getServerRepositories();
  return projects.getById(id);
});

export const getAllProjectParams = async () => {
  const { projects } = await getServerRepositories();
  const items = await projects.getAll();
  return items.map((item) => ({ id: item.id }));
};

export const getProjectDetailMetadata = async (id: string): Promise<Metadata> => {
  const project = await getProject(id);
  if (!project) return {};

  const title = `${project.title} — 경산 대구 샤시 샷시 시공 | ${BUSINESS.name}`;
  const description = `경산 대구 ${project.categories.join(", ")} 시공사례 — ${project.description} 샤시(샷시) 전문 ${BUSINESS.name} ${BUSINESS.phone}`;

  const primaryImage = project.primary_image ?? project.images[0];
  const ogImages = primaryImage
    ? [
        {
          url: primaryImage,
          alt: project.title,
        },
        ...project.images
          .filter((img) => img !== primaryImage)
          .map((img) => ({
            url: img,
            alt: project.title,
          })),
      ]
    : [];

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects/${id}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ko_KR",
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
};
