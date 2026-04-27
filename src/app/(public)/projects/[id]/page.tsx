import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  return (
    <article>
      <Link href="/projects" className="text-navy hover:underline dark:text-blue-400">
        ← 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-navy dark:text-white">{project.title}</h1>
      <span className="mt-2 inline-block rounded bg-gray-light px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-300">
        {project.category}
      </span>
      <p className="mt-4 text-gray-dark dark:text-gray-300">{project.description}</p>

      {project.images.length > 0 && (
        <section className="mt-6" aria-label="프로젝트 이미지">
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.images.slice(0, 8).map((img, i) => (
              <li key={i}>
                <Image
                  src={img}
                  alt={`${project.title} 이미지 ${i + 1}`}
                  width={800}
                  height={600}
                  className="rounded-lg object-cover"
                />
              </li>
            ))}
          </ul>
          {project.images.length > 8 && (
            <p className="mt-3 text-center text-sm text-gray-dark dark:text-gray-400">
              외 {project.images.length - 8}장
            </p>
          )}
        </section>
      )}
    </article>
  );
}
