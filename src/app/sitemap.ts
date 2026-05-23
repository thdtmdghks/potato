import type { MetadataRoute } from "next";
import { getServerRepositories } from "@/server";
import { SITE_URL } from "@/shared/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getServerRepositories();
  const allProjects = await projects.getAll();

  const projectUrls = allProjects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: new Date(p.created_at),
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/projects`, lastModified: new Date() },
    ...projectUrls,
  ];
}
