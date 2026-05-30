"use client";

import Image from "next/image";

interface ImageThumbnailProps {
  url: string;
  onRemove: () => void;
  isPrimary?: boolean;
  onSelectPrimary?: () => void;
  onPreview?: () => void;
}

export function ImageThumbnail({
  url,
  onRemove,
  isPrimary = false,
  onSelectPrimary,
  onPreview,
}: ImageThumbnailProps) {
  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded border-2 transition-all ${
        isPrimary
          ? "border-amber-500 bg-amber-500/5 dark:border-amber-500"
          : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
      }`}
      onClick={onPreview}
    >
      <Image
        src={url}
        alt=""
        width={160}
        height={120}
        sizes="160px"
        className="h-[110px] w-[146px] rounded object-cover"
      />

      {onSelectPrimary && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPrimary();
          }}
          className={`absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs shadow transition-all ${
            isPrimary
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-white/80 text-gray-400 hover:bg-white hover:text-amber-500 dark:bg-gray-800/80"
          }`}
          title={isPrimary ? "대표사진으로 지정됨" : "대표사진으로 설정"}
        >
          ★
        </button>
      )}

      {isPrimary && (
        <span className="absolute right-1 bottom-1 rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-white shadow-sm">
          대표
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
