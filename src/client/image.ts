import imageCompression from "browser-image-compression";

const OPTIONS = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
};

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, OPTIONS);
}
