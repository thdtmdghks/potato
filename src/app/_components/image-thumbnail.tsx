"use client";

import Image from "next/image";

interface ImageThumbnailProps {
  url: string;
  onRemove: () => void;
  isPrimary?: boolean;
  onSelectPrimary?: () => void;
}

export function ImageThumbnail({
  url,
  onRemove,
  isPrimary = false,
  onSelectPrimary,
}: ImageThumbnailProps) {
  return (
    <div
      className={`relative cursor-pointer rounded border-2 transition-all ${
        isPrimary ? "border-amber-500 bg-amber-500/5 dark:border-amber-500" : "border-transparent"
      }`}
      onClick={onSelectPrimary}
    >
      <Image
        src={url}
        alt=""
        width={100}
        height={75}
        sizes="100px"
        className="h-[71px] w-[96px] rounded object-cover"
      />
      {isPrimary && (
        <span className="absolute top-1 left-1 rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-white shadow-sm">
          ★ 대표
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600"
        aria-label="이미지 삭제"
      >
        ×
      </button>
    </div>
  );
}
