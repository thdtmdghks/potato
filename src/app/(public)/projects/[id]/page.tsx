import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import type { Project } from "@/shared/types";

async function getProject(id: string): Promise<Project | null> {
  try {
    const { projects } = await getServerRepositories();
    return projects.getById(id);
  } catch {
    return null;
  }
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div>
      <Link href="/projects" className="text-navy hover:underline">
        ← 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-navy">{project.title}</h1>
      <span className="mt-2 inline-block rounded bg-gray-light px-2 py-1 text-sm">{project.category}</span>
      <p className="mt-4 text-gray-dark">{project.description}</p>

      {project.images.length > 0 && (
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {project.images.map((img, i) => (
            <div key={i} className="h-48 rounded bg-gray-light" />
          ))}
        </div>
      )}
    </div>
  );
}
