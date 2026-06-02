/**
 * 대표 이미지를 결정한다.
 * 우선순위:
 * 1. 선택된 URL이 최종 이미지 목록에 존재하면 그대로 사용
 * 2. 새 업로드 이미지 중 index로 지정된 것
 * 3. 전체 이미지 중 첫 번째 fallback
 */
export const resolvePrimaryImage = ({
  primaryImageUrl,
  primaryImageIndex,
  existingImages,
  newImageUrls,
}: {
  primaryImageUrl?: string | null;
  primaryImageIndex: number | null;
  existingImages: string[];
  newImageUrls: string[];
}): string | null => {
  const allImages = [...existingImages, ...newImageUrls];

  if (primaryImageUrl && allImages.includes(primaryImageUrl)) {
    return primaryImageUrl;
  }
  if (primaryImageIndex !== null && !isNaN(primaryImageIndex) && newImageUrls[primaryImageIndex]) {
    return newImageUrls[primaryImageIndex];
  }
  return allImages[0] ?? null;
};
