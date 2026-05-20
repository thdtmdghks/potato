import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { ProjectForm } from "../../_components/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  return <ProjectForm project={project} />;
}
