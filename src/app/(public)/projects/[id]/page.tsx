import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerRepositories } from "@/server";
import { getProjectDetailMetadata } from "./_utils";
import { ProjectJsonLd } from "./_components/project-json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return getProjectDetailMetadata(id);
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  return (
    <>
      <ProjectJsonLd project={project} />
      <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h1 className="text-navy text-2xl font-bold md:text-3xl dark:text-white">
          {project.title}
        </h1>
        <span className="bg-gray-light mt-3 inline-block rounded-full px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-300">
          {project.category}
        </span>
        <p className="text-gray-dark mt-4 leading-relaxed dark:text-gray-300">
          {project.description}
        </p>

        {project.images.length > 0 && (
          <section className="mt-8" aria-label="시공 사진">
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.images.map((img, i) => (
                <li key={i}>
                  <Image
                    src={img}
                    alt={`${project.title} 시공 사진 ${i + 1}`}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 pr-4 text-right">
          <Link
            href="/projects"
            className="bg-navy hover:bg-navy-light inline-block rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
          >
            목록보기
          </Link>
        </div>
      </article>
    </>
  );
}
