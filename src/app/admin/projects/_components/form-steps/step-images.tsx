import type { ChangeEvent } from "react";
import { ImageUpload } from "@/app/_components/image-upload";
import { PROJECT_CONFIG } from "@/shared/constants";
import { StepNavigation } from "./step-navigation";

interface StepImagesProps {
  existingImages: string[];
  previews: string[];
  compressing: boolean;
  handleFiles: (e: ChangeEvent<HTMLInputElement>) => void;
  removeExisting: (idx: number) => void;
  removeNew: (idx: number) => void;
  primaryImageUrl: string | null;
  setSelectedPrimary: (url: string) => void;
  compressedFiles: File[];
  onNext: () => void;
}

export function StepImages({
  existingImages,
  previews,
  compressing,
  handleFiles,
  removeExisting,
  removeNew,
  primaryImageUrl,
  setSelectedPrimary,
  compressedFiles,
  onNext,
}: StepImagesProps) {
  const totalImageCount = existingImages.length + previews.length;

  return (
    <section className="animate-fade-in space-y-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all md:p-6 dark:border-gray-800 dark:bg-[#121824]">
      <div className="border-b border-gray-50 pb-3 dark:border-gray-800">
        <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
          📸 1단계: 현장 시공 사진 등록
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          시공이 완료된 전후 사진을 등록해 주세요. 가장 깔끔하고 멋진 사진을 탭해 별표(대표 사진)로
          지정해 줍니다.
        </p>
      </div>

      <ImageUpload
        label="시공 사진 첨부"
        description="WebP 포맷 압축 권장. 썸네일을 터치하여 '대표 사진'을 지정할 수 있습니다."
        existingImages={existingImages}
        previews={previews}
        compressing={compressing}
        maxCount={PROJECT_CONFIG.MAX_IMAGES}
        onFilesChange={handleFiles}
        onRemoveExisting={removeExisting}
        onRemoveNew={removeNew}
        primaryImageUrl={primaryImageUrl}
        onSelectPrimary={setSelectedPrimary}
        compressedFiles={compressedFiles}
      />

      <StepNavigation onNext={onNext} isNextDisabled={totalImageCount === 0 || compressing} />
    </section>
  );
}
