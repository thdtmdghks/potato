import imageCompression from "browser-image-compression";

const OPTIONS = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
};

const AI_OPTIONS = {
  maxSizeMB: 0.04, // 40KB 이하
  maxWidthOrHeight: 768, // AI 이미지 인식에 충분한 크기
  useWebWorker: true,
  fileType: "image/webp",
};

export const compressImage = async (file: File): Promise<File> => {
  return imageCompression(file, OPTIONS);
};

export const compressImageForAi = async (file: File): Promise<File> => {
  return imageCompression(file, AI_OPTIONS);
};
