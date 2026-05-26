"use client";

import Image from "next/image";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/app/_components/carousel";
import type { Project } from "@/shared/types";

interface Props {
  projects: Project[];
}

export function ProjectCarousel({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <Carousel
      opts={{ loop: true, align: "start", dragFree: true }}
      plugins={[AutoScroll({ speed: 2, stopOnInteraction: false, stopOnMouseEnter: false })]}
      className="w-full"
    >
      <CarouselContent className="-ml-2">
        {projects.flatMap((project) =>
          project.images.map((url, idx) => (
            <CarouselItem
              key={`${project.id}-${idx}`}
              className="basis-2/3 pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/projects/${project.id}`} className="block overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`${project.title} 시공사례`}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={idx === 0}
                  className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105"
                />
              </Link>
            </CarouselItem>
          )),
        )}
      </CarouselContent>
    </Carousel>
  );
}
