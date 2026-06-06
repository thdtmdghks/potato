"use client";

import { Avatar } from "@/app/_components/avatar";
import { ImageThumbnail } from "@/app/_components/image-thumbnail";
import { formatDate } from "@/shared/utils";

const VARIANT_STYLES = {
  default: "",
  original: "rounded-xl bg-red-50/50 dark:bg-red-950/15",
  edit: "rounded-xl bg-emerald-50/50 dark:bg-emerald-950/15",
} as const;

interface ReviewCardContentProps {
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  rating: number;
  content: string;
  images: string[];
  primaryImage: string | null;
  variant?: keyof typeof VARIANT_STYLES;
  label?: string;
  onSelectPrimary?: (url: string) => void;
  onPreviewImage?: (urls: string[], index: number) => void;
}

export function ReviewCardContent({
  authorName,
  authorAvatar,
  createdAt,
  rating,
  content,
  images,
  primaryImage,
  variant = "default",
  label,
  onSelectPrimary,
  onPreviewImage,
}: ReviewCardContentProps) {
  return (
    <div className={VARIANT_STYLES[variant]}>
      {label && (
        <p
          className={`mb-3 text-xs font-bold tracking-wider uppercase ${
            variant === "original"
              ? "text-red-500"
              : variant === "edit"
                ? "text-emerald-600"
                : "text-gray-400"
          }`}
        >
          {label}
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={authorAvatar} size={32} />
          <div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {authorName}
            </span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-700">|</span>
            <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-700">|</span>
            <span className="text-xs font-semibold text-amber-500">★ {rating}점</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
          {content}
        </p>

        {images.length > 0 && (
          <div className="space-y-1.5">
            {onSelectPrimary && (
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                별표 클릭 시 대표 설정 / 이미지 클릭 시 크게 보기
              </span>
            )}
            <div className="flex gap-2 overflow-x-auto py-1">
              {images.map((url, idx) => (
                <ImageThumbnail
                  key={url}
                  url={url}
                  isPrimary={primaryImage === url}
                  onSelectPrimary={onSelectPrimary ? () => onSelectPrimary(url) : undefined}
                  onPreview={onPreviewImage ? () => onPreviewImage(images, idx) : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
