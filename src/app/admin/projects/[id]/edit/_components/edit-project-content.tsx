import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { ProjectForm } from "../../../_components/project-form";

interface Props {
  id: string;
}

export async function EditProjectContent({ id }: Props) {
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  return <ProjectForm project={project} />;
}
