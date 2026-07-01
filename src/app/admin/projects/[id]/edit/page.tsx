import { Suspense } from "react";
import { EditProjectContent } from "./_components/edit-project-content";
import { EditProjectSkeleton } from "./_components/edit-project-skeleton";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditProjectSkeleton />}>
      <EditProjectContent id={id} />
    </Suspense>
  );
}
