import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import { getHomeProjects } from "../_utils";
import { ProjectCarousel } from "./project-carousel";

export async function ProjectCarouselSection() {
  const recentProjects = await getHomeProjects();

  return (
    <section id="gallery" className="pt-20 pb-10">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-navy text-center text-2xl font-bold dark:text-white">시공사례</h2>
        <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-400">
          실제 현장 시공 모습을 확인하세요
        </p>
      </div>
      <div className="mt-10">
        <ProjectCarousel projects={recentProjects} />
      </div>
      <div className="mx-auto mt-6 max-w-5xl px-4 text-right">
        <Link
          href={ROUTES.projects}
          className="text-navy hover:text-accent text-sm dark:text-blue-400"
        >
          전체보기 →
        </Link>
      </div>
    </section>
  );
}
