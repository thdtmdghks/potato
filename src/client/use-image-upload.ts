import { useState, type ChangeEvent } from "react";
import { compressImage } from "./image";

const MAX_SINGLE_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_TOTAL_COMPRESSED_SIZE = 8 * 1024 * 1024; // 8MB

interface UseImageUploadOptions {
  initialImages?: string[];
  maxCount?: number;
  onError?: (message: string) => void;
}

export function useImageUpload({
  initialImages = [],
  maxCount = 5,
  onError,
}: UseImageUploadOptions = {}) {
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const currentTotal = existingImages.length + previews.length;
    const remainingSlots = maxCount - currentTotal;

    if (remainingSlots <= 0) {
      onError?.(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
      e.target.value = "";
      return;
    }

    let targetFiles = files;
    let limitExceeded = false;

    if (files.length > remainingSlots) {
      targetFiles = files.slice(0, remainingSlots);
      limitExceeded = true;
    }

    setCompressing(true);
    const compressed: File[] = [];
    const urls: string[] = [];

    const currentCompressedSize = compressedFiles.reduce((sum, f) => sum + f.size, 0);
    let accumulatedSize = currentCompressedSize;

    for (const file of targetFiles) {
      if (!file.type.startsWith("image/")) {
        onError?.(`이미지 파일만 업로드할 수 있습니다.`);
        continue;
      }
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        onError?.(`파일이 너무 큽니다. 20MB 이하의 이미지 파일만 업로드할 수 있습니다.`);
        continue;
      }
      try {
        const result = await compressImage(file);
        if (accumulatedSize + result.size > MAX_TOTAL_COMPRESSED_SIZE) {
          onError?.(`첨부할 이미지의 총 용량이 8MB를 초과하여 일부 이미지가 추가되지 않았습니다.`);
          continue;
        }
        accumulatedSize += result.size;
        compressed.push(result);
        urls.push(URL.createObjectURL(result));
      } catch {
        onError?.(`"${file.name}" 압축에 실패했습니다. 다른 이미지를 사용해주세요.`);
      }
    }

    setCompressedFiles((prev) => [...prev, ...compressed]);
    setPreviews((prev) => [...prev, ...urls]);
    setCompressing(false);
    e.target.value = "";

    if (limitExceeded) {
      onError?.(`최대 ${maxCount}장까지만 업로드할 수 있어 초과한 이미지는 제외되었습니다.`);
    }
  };

  const removeExisting = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx: number) => {
    if (previews[idx]) {
      URL.revokeObjectURL(previews[idx]);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setCompressedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const clear = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setExistingImages([]);
    setCompressedFiles([]);
    setPreviews([]);
    setCompressing(false);
  };

  return {
    existingImages,
    setExistingImages,
    compressedFiles,
    setCompressedFiles,
    previews,
    setPreviews,
    compressing,
    handleFiles,
    removeExisting,
    removeNew,
    clear,
  };
}
