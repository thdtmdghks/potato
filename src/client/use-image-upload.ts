import { useState, type ChangeEvent } from "react";
import { compressImage } from "./image";

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
    if (currentTotal + files.length > maxCount) {
      onError?.(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
      e.target.value = "";
      return;
    }

    setCompressing(true);
    const compressed: File[] = [];
    const urls: string[] = [];

    for (const file of files) {
      try {
        const result = await compressImage(file);
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
