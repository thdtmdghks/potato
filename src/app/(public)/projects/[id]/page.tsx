import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerRepositories } from "@/server";
import { BUSINESS } from "@/shared/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) return {};

  const title = `${project.title} — ${BUSINESS.region} 샤시(샷시) | ${BUSINESS.name}`;
  const description = `${BUSINESS.region} ${project.category} 시공사례 — ${project.description} 샤시(샷시) 전문 ${BUSINESS.name} ${BUSINESS.phone}`;

  const ogImages = project.images.map((img) => ({
    url: img,
    alt: project.title,
  }));

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${id}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ko_KR",
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.images.length > 0 ? [project.images[0]] : undefined,
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getServerRepositories();
  const project = await projects.getById(id);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.images.length > 0 ? project.images : ["/og-image.png"],
    datePublished: new Date(project.created_at).toISOString(),
    author: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "원효로40길 64-8",
        addressLocality: "경산시",
        addressRegion: "경상북도",
        addressCountry: "KR",
      },
    },
    publisher: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "원효로40길 64-8",
        addressLocality: "경산시",
        addressRegion: "경상북도",
        addressCountry: "KR",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
