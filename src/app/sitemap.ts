import type { MetadataRoute } from "next";
import { getServerRepositories } from "@/server";
import { SITE_URL } from "@/shared/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, reviews } = await getServerRepositories();
  const allProjects = await projects.getAll();
  const approvedReviews = await reviews.getAllApproved();

  const projectUrls = allProjects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: new Date(p.created_at).toISOString(),
  }));

  const reviewUrls = approvedReviews.map((r) => ({
    url: `${SITE_URL}/reviews/${r.id}`,
    lastModified: new Date(r.updated_at).toISOString(),
  }));

  return [
    { url: SITE_URL, lastModified: new Date().toISOString() },
    { url: `${SITE_URL}/projects`, lastModified: new Date().toISOString() },
    { url: `${SITE_URL}/reviews`, lastModified: new Date().toISOString() },
    ...projectUrls,
    ...reviewUrls,
  ];
}
