"use client";

import { useState, type ChangeEvent } from "react";
import { Label } from "./label";
import { ImageThumbnail } from "./image-thumbnail";
import { LightboxModal } from "./lightbox-modal";

interface ImageUploadProps {
  label?: string;
  description?: string;
  existingImages: string[];
  previews: string[];
  compressing: boolean;
  maxCount?: number;
  onFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (idx: number) => void;
  onRemoveNew: (idx: number) => void;
  required?: boolean;
  primaryImageUrl?: string | null;
  onSelectPrimary?: (url: string) => void;
}

export function ImageUpload({
  label = "사진 첨부",
  description,
  existingImages,
  previews,
  compressing,
  maxCount = 5,
  onFilesChange,
  onRemoveExisting,
  onRemoveNew,
  required = false,
  primaryImageUrl,
  onSelectPrimary,
}: ImageUploadProps) {
  const totalCount = existingImages.length + previews.length;
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {description && (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        {/* 기존 사진 */}
        {existingImages.map((url, idx) => (
          <ImageThumbnail
            key={`existing-${idx}`}
            url={url}
            isPrimary={primaryImageUrl === url}
            onSelectPrimary={onSelectPrimary ? () => onSelectPrimary(url) : undefined}
            onPreview={() => setActiveLightboxUrl(url)}
            onRemove={() => onRemoveExisting(idx)}
          />
        ))}

        {/* 새로 올린 사진 */}
        {previews.map((url, idx) => (
          <ImageThumbnail
            key={`new-${idx}`}
            url={url}
            isPrimary={primaryImageUrl === url}
            onSelectPrimary={onSelectPrimary ? () => onSelectPrimary(url) : undefined}
            onPreview={() => setActiveLightboxUrl(url)}
            onRemove={() => onRemoveNew(idx)}
          />
        ))}

        {/* 업로드 버튼 */}
        {totalCount < maxCount && (
          <label className="hover:border-accent dark:hover:border-accent flex h-[114px] w-[150px] cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">사진 추가</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onFilesChange}
              disabled={compressing}
            />
          </label>
        )}
      </div>
      {compressing && (
        <p className="mt-2 animate-pulse text-xs text-blue-500">
          이미지를 변환 및 단열/압축 처리 중입니다...
        </p>
      )}

      {activeLightboxUrl && (
        <LightboxModal url={activeLightboxUrl} onClose={() => setActiveLightboxUrl(null)} />
      )}
    </div>
  );
}
