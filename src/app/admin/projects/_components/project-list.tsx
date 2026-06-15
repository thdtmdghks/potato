"use client";

import { useState, useMemo } from "react";
import { useHistoryModal } from "@/client/use-history-modal";
import type { Project } from "@/shared/types";
import { CATEGORIES, BUILDING_TYPES } from "@/shared/constants";
import { Input } from "@/app/_components/input";
import { LightboxModal } from "@/app/_components/lightbox-modal";
import { ProjectCard } from "./project-card";

interface Props {
  items: Project[];
}

interface LightboxState {
  urls: string[];
  index: number;
}

export function ProjectList({ items }: Props) {
  const {
    value: activeLightbox,
    open: openLightbox,
    close: closeLightbox,
  } = useHistoryModal<LightboxState>("projectLightbox");

  // 검색 및 필터 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<string | null>(null);

  // 시공사례 필터링 계산
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const regionMatch = (item.region || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = searchQuery.trim() === "" || titleMatch || regionMatch;

      const matchesCategory =
        !selectedCategory || (item.categories || []).includes(selectedCategory);

      const matchesBuildingType =
        !selectedBuildingType || item.building_type === selectedBuildingType;

      return matchesSearch && matchesCategory && matchesBuildingType;
    });
  }, [items, searchQuery, selectedCategory, selectedBuildingType]);

  return (
    <div className="space-y-6">
      {/* 프리미엄 검색 & 필터 대시보드 */}
      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#121824]">
        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute top-3.5 left-4 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="프로젝트 제목 또는 시공 지역(예: 사동, 범어동)으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border-gray-200 bg-gray-50/30 pl-11 text-base transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedBuildingType || ""}
              onChange={(e) => setSelectedBuildingType(e.target.value || null)}
              className="dark:text-gray-250 h-12 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">모든 건물유형</option>
              {BUILDING_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 카테고리 필터 칩 목록 */}
        <div className="dark:border-gray-855 flex flex-wrap items-center gap-1.5 border-t border-gray-50 pt-1.5">
          <span className="dark:text-gray-555 mr-1.5 text-xs font-bold tracking-wider text-gray-400 uppercase">
            품목 필터:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
              selectedCategory === null
                ? "bg-navy border-navy text-white dark:border-blue-600 dark:bg-blue-600"
                : "text-gray-655 border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            전체 보기
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? "bg-navy border-navy text-white dark:border-blue-600 dark:bg-blue-600"
                    : "text-gray-655 border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 리스트 건수 요약 */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500 dark:text-gray-400">
        <span>
          검색 결과:{" "}
          <strong className="text-navy font-bold dark:text-white">{filteredItems.length}건</strong>{" "}
          / 전체 {items.length}건
        </span>
        {(searchQuery || selectedCategory || selectedBuildingType) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setSelectedBuildingType(null);
            }}
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 포트폴리오 리스트 카드 */}
      {filteredItems.length === 0 ? (
        <section className="dark:border-gray-855 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-navy mt-4 font-semibold dark:text-gray-200">
            필터에 부합하는 시공사례가 없습니다.
          </p>
          <p className="text-gray-dark mt-1 text-xs dark:text-gray-400">
            검색어 또는 필터 칩을 해제하여 등록된 시공사례를 조회하세요.
          </p>
        </section>
      ) : (
        <ul className="space-y-4">
          {filteredItems.map((item) => (
            <ProjectCard
              key={item.id}
              item={item}
              onImageClick={(img, idx, sortedImages) => {
                openLightbox({ urls: sortedImages, index: idx });
              }}
            />
          ))}
        </ul>
      )}

      {/* 이미지 확대 라이트박스(Lightbox) 모달 */}
      {activeLightbox && (
        <LightboxModal
          urls={activeLightbox.urls}
          initialIndex={activeLightbox.index}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
