import type { Metadata } from "next";
import { getServerRepositories } from "@/server";
import { BUSINESS, SITE_URL } from "@/shared/constants";

export async function getProjectDetailMetadata(id: string): Promise<Metadata> {
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) return {};

  const title = `${project.title} — 경산 대구 샤시 샷시 시공 | ${BUSINESS.name}`;
  const description = `경산 대구 ${project.category} 시공사례 — ${project.description} 샤시(샷시) 전문 ${BUSINESS.name} ${BUSINESS.phone}`;

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
}
