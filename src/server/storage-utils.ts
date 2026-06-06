import type { StorageRepository } from "./repositories";
import { logError } from "./logger";

/**
 * Supabase Storage 공개 URL에서 버킷 이후 경로를 추출한다.
 */
export const extractStoragePath = (url: string): string | null => {
  const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  return match?.[1] ?? null;
};

/**
 * 파일 배열을 Storage에 업로드하고 공개 URL 배열을 반환한다.
 */
export const uploadImages = async (
  storage: StorageRepository,
  files: File[],
  bucket: string,
  pathPrefix: string,
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    const path = `${pathPrefix}/${crypto.randomUUID()}.webp`;
    const url = await storage.upload(bucket, path, file);
    urls.push(url);
  }
  return urls;
};

/**
 * Storage에서 이미지를 삭제한다. (fire-and-forget, 실패 시 로깅)
 */
export const deleteImages = (storage: StorageRepository, bucket: string, urls: string[]) => {
  for (const url of urls) {
    const path = extractStoragePath(url);
    if (path) {
      storage.delete(bucket, path).catch((err) => {
        logError("storage-utils.deleteImages", err, { bucket, path });
      });
    }
  }
};
