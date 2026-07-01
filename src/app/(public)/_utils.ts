import { cache } from "react";
import { getServerRepositories } from "@/server";

export const getHomeProjects = cache(async () => {
  const { projects } = await getServerRepositories();
  return projects.getAll();
});

export const getHomeReviews = cache(async () => {
  const { reviews } = await getServerRepositories();
  return reviews.getAllApproved();
});
