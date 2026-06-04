"use client";

import { useState } from "react";
import Image from "next/image";
import { LightboxModal } from "@/app/_components/lightbox-modal";

interface Props {
  images: string[];
  primaryImage: string | null;
}

export function ReviewDetailImages({ images, primaryImage }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">시공 사진</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((url, idx) => (
          <div
            key={url}
            onClick={() => setLightboxIndex(idx)}
            className={`group relative cursor-pointer overflow-hidden rounded-lg ${
              primaryImage === url ? "ring-2 ring-amber-500" : ""
            }`}
          >
            <Image
              src={url}
              alt={`시공 사진 ${idx + 1}`}
              width={400}
              height={300}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {primaryImage === url && (
              <span className="absolute right-2 bottom-2 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                대표
              </span>
            )}
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <LightboxModal
          urls={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
