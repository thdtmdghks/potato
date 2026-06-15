import Image from "next/image";
import { Sparkles } from "lucide-react";

interface LivePreviewCardProps {
  title: string;
  description: string;
  images: string[];
  primaryImage: string | null;
  categories: string[];
  region?: string | null;
  buildingType?: string | null;
}

export function LivePreviewCard({
  title,
  description,
  images,
  primaryImage,
  categories,
  region,
  buildingType,
}: LivePreviewCardProps) {
  const displayImage = primaryImage || (images && images.length > 0 ? images[0] : null);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* 이미지 영역 */}
      <div className="relative aspect-[16/10] w-full bg-gray-50 dark:bg-gray-800">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title || "시공 사례 대표 이미지"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            unoptimized={displayImage.startsWith("data:")} // base64 이미지 대응
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
            <span className="text-3xl">🖼️</span>
            <span className="text-xs font-medium">등록된 시공 사진이 없습니다.</span>
          </div>
        )}
        <div className="bg-navy/80 absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-[4px] dark:bg-black/60">
          <Sparkles className="text-accent h-3 w-3" />
          <span>실시간 미리보기</span>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-5 md:p-6">
        {/* 태그 리스트 */}
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {region && (
            <span className="bg-navy/5 text-navy dark:bg-navy/20 rounded px-2 py-0.5 text-[11px] font-medium dark:text-gray-300">
              📍 {region}
            </span>
          )}
          {buildingType && (
            <span className="bg-navy/5 text-navy dark:bg-navy/20 rounded px-2 py-0.5 text-[11px] font-medium dark:text-gray-300">
              🏢 {buildingType}
            </span>
          )}
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light rounded px-2 py-0.5 text-[11px] font-semibold"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* 제목 */}
        <h3 className="text-navy line-clamp-1 text-base leading-snug font-bold md:text-lg dark:text-white">
          {title || "시공 사례 제목이 여기에 표시됩니다."}
        </h3>

        {/* 설명글 */}
        <p className="text-gray-dark mt-2.5 line-clamp-4 min-h-[4.5rem] text-sm leading-relaxed whitespace-pre-wrap dark:text-gray-300">
          {description ||
            "입력한 시공 정보 또는 AI가 생성한 설명글이 여기에 실시간으로 미리보기로 표시됩니다."}
        </p>
      </div>
    </article>
  );
}
