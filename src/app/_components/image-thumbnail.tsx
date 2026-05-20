"use client";

import Image from "next/image";

interface ImageThumbnailProps {
  url: string;
  onRemove: () => void;
}

export function ImageThumbnail({ url, onRemove }: ImageThumbnailProps) {
  return (
    <div className="relative">
      <Image
        src={url}
        alt=""
        width={100}
        height={75}
        className="h-[75px] w-[100px] rounded object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
        aria-label="이미지 삭제"
      >
        ×
      </button>
    </div>
  );
}
