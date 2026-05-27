import type { Metadata } from "next";
import { getServerRepositories } from "@/server";
import { BUSINESS } from "@/shared/constants";

export async function getProjectDetailMetadata(id: string): Promise<Metadata> {
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) return {};

  const title = `${project.title} — ${BUSINESS.region} 샤시(샷시) | ${BUSINESS.name}`;
  const description = `${BUSINESS.region} ${project.category} 시공사례 — ${project.description} 샤시(샷시) 전문 ${BUSINESS.name} ${BUSINESS.phone}`;

  const ogImages = project.images.map((img) => ({
    url: img,
    alt: project.title,
  }));

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${id}`,
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
      images: project.images.length > 0 ? [project.images[0]] : undefined,
    },
  };
}
