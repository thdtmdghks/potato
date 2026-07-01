import { Suspense } from "react";
import type { Metadata } from "next";
import { getProjectDetailMetadata, getAllProjectParams } from "./_utils";
import { ProjectDetailContent } from "./_components/project-detail-content";
import { ProjectDetailSkeleton } from "./_components/project-detail-skeleton";

export async function generateStaticParams() {
  return getAllProjectParams();
}

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

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailContent id={id} />
    </Suspense>
  );
}
