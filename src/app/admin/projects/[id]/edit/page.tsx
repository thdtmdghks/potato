import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { EditProjectForm } from "./edit-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  return <EditProjectForm project={project} />;
}
