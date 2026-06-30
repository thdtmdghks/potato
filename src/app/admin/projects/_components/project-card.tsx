import Image from "next/image";
import Link from "next/link";
import { DeleteButton } from "./delete-button";
import { ROUTES } from "@/shared/routes";
import type { Project } from "@/shared/types";

interface ProjectCardProps {
  item: Project;
  onImageClick: (imgUrl: string, index: number, allImages: string[]) => void;
}

export function ProjectCard({ item, onImageClick }: ProjectCardProps) {
  const allImages = item.images || [];
  const primaryImg = item.primary_image || allImages[0];

  // 사진 순서 정렬: 대표 이미지가 제일 앞으로 오도록 하고 그 뒤로 나머지 순서대로 정렬
  const sortedImages = (() => {
    if (allImages.length === 0) return [];
    if (!primaryImg) return allImages;
    const rest = allImages.filter((img) => img !== primaryImg);
    return [primaryImg, ...rest];
  })();

  return (
    <li className="flex flex-col gap-4.5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-500/25 hover:shadow-md md:p-6 dark:border-gray-800/80 dark:bg-[#121824] dark:hover:border-blue-500/35">
      {/* 1층: 시공 사진들 가로 휠 스크롤 영역 (대표가 가장 맨 앞으로 정렬됨) */}
      {sortedImages.length > 0 && (
        <div className="scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 flex gap-2.5 overflow-x-auto pb-2">
          {sortedImages.map((img, idx) => {
            const isPrimary = img === primaryImg;
            return (
              <button
                key={img}
                type="button"
                onClick={() => onImageClick(img, idx, sortedImages)}
                className={`relative h-16 w-22 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                  isPrimary
                    ? "border-amber-500 ring-2 ring-amber-500/20"
                    : "border-gray-150 bg-gray-50 dark:border-gray-800 dark:bg-gray-800"
                }`}
                title={isPrimary ? "대표 시공 사진" : "일반 시공 사진"}
              >
                <Image src={img} alt="" fill sizes="88px" className="object-cover" />
                {isPrimary && (
                  <span className="absolute right-1 bottom-1 rounded bg-amber-500 px-1.5 py-0.5 text-[8px] leading-none font-bold text-white shadow-sm">
                    ★ 대표
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2층: 텍스트 정보 및 제어 버튼 세트 */}
      <div className="dark:border-gray-855/60 flex flex-col items-start justify-between gap-4 border-t border-gray-50 pt-3.5 md:flex-row md:items-center">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-1">
            {/* 카테고리 다중 배지 */}
            {(item.categories || []).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-lg bg-blue-50/75 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              >
                {cat}
              </span>
            ))}
            {/* 건물유형 배지 */}
            {item.building_type && (
              <span className="dark:bg-gray-850 inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-0.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                {item.building_type}
              </span>
            )}
          </div>

          <h2 className="text-navy line-clamp-1 text-base leading-snug font-bold tracking-tight sm:line-clamp-2 dark:text-white">
            {item.title}
          </h2>

          {/* 지역 및 사진 갯수 정보 */}
          <div className="text-gray-dark flex items-center gap-1.5 text-xs dark:text-gray-400">
            <span className="dark:bg-gray-855 inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:text-gray-400">
              📍 {item.region || "지역 미지정"}
            </span>
            <span>·</span>
            <span className="font-semibold text-gray-500 dark:text-gray-500">
              사진 총 {allImages.length}장
            </span>
          </div>
        </div>

        {/* 제어 버튼 세트 */}
        <div className="dark:border-gray-850 flex w-full shrink-0 items-center justify-end gap-1.5 border-t border-gray-50 pt-3.5 md:w-auto md:border-t-0 md:pt-0">
          <Link
            href={ROUTES.admin.projectEdit(item.id)}
            className="text-gray-655 inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3.5 text-xs font-bold transition-all hover:bg-gray-50 active:scale-[0.97] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            수정
          </Link>
          <DeleteButton id={item.id} />
        </div>
      </div>
    </li>
  );
}
