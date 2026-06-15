import { useState } from "react";
import { Label } from "@/app/_components/label";
import { Input } from "@/app/_components/input";
import { REGION_CONFIG } from "@/shared/constants";
import { StepNavigation } from "./step-navigation";

interface StepLocationProps {
  initialRegion: string;
  onNext: (region: string, city: string, town: string) => void;
  onPrev: () => void;
}

const REGION_QUICK_TOWNS = {
  대구: ["범어동", "만촌동", "신암동", "침산동", "대명동", "상인동", "황금동"],
  경산: ["사동", "옥산동", "계양동", "백천동", "삼북동", "중방동", "임당동"],
};

export function StepLocation({ initialRegion, onNext, onPrev }: StepLocationProps) {
  const initialCity = initialRegion
    ? initialRegion.startsWith(REGION_CONFIG.CITIES[1]) // 대구
      ? REGION_CONFIG.CITIES[1]
      : initialRegion.startsWith(REGION_CONFIG.CITIES[0]) // 경산
        ? REGION_CONFIG.CITIES[0]
        : "기타"
    : REGION_CONFIG.DEFAULT_CITY;

  const initialTown = initialRegion
    ? initialCity === "기타"
      ? initialRegion
      : initialRegion.replace(REGION_CONFIG.CLEAN_REGEXP, "")
    : "";

  const [city, setCity] = useState(initialCity);
  const [town, setTown] = useState(initialTown);

  const handleNext = () => {
    if (!town.trim()) return;
    const fullRegion = city === "기타" ? town.trim() : `${city} ${town}`.trim();
    onNext(fullRegion, city, town);
  };

  return (
    <section className="animate-fade-in space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all md:p-6 dark:border-gray-800 dark:bg-[#121824]">
      <div className="border-b border-gray-50 pb-3 dark:border-gray-800">
        <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
          📍 2단계: 시공 위치 설정
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          시공이 이루어진 해당 지역의 도시를 고르거나 직접 적어주세요.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            시공 도시 선택
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {[...REGION_CONFIG.CITIES, "기타"].map((c) => {
              const isSelected = city === c;
              const displayLabel = c === "기타" ? "기타 지역" : c;
              return (
                <label
                  key={c}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-3.5 text-center transition-all select-none active:scale-[0.98] ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/20 font-bold text-blue-600 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
                      : "border-gray-155 text-gray-655 dark:border-gray-855 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="city-selection"
                    value={c}
                    checked={isSelected}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setTown("");
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold">{displayLabel}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="town" className="text-gray-755 text-sm font-semibold dark:text-gray-200">
            {city === "기타"
              ? "시공 지역 전체 입력 (시/군 + 동/읍/면)"
              : "상세 지역 (동/리 명칭 입력)"}
          </Label>
          <Input
            id="town"
            placeholder={
              city === "기타"
                ? "예: 영천 금호읍, 부산 해운대구, 칠곡 왜관읍"
                : "예: 사동, 계양동, 범어동, 만촌동"
            }
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="h-12 w-full rounded-xl border-gray-200 px-4 text-base transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700"
          />

          {city && REGION_QUICK_TOWNS[city as keyof typeof REGION_QUICK_TOWNS] && (
            <div className="pt-2">
              <span className="text-gray-450 dark:text-gray-555 mb-2 block text-[10px] font-bold tracking-wider uppercase">
                📍 {city} 자주 시공하는 동네 (탭하면 즉시 입력)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REGION_QUICK_TOWNS[city as keyof typeof REGION_QUICK_TOWNS].map((t) => {
                  const isCurrentTown = town === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTown(t)}
                      className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                        isCurrentTown
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "text-gray-655 hover:border-gray-350 dark:bg-gray-855 dark:hover:bg-gray-750 border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {city === "기타" && (
            <p className="dark:text-gray-555 pt-1 text-[10px] leading-relaxed text-gray-400">
              ※ 대구/경산 외의 기타 지역은 검색 노출과 정확한 노출을 위해 시/군/구 단위를 명확히
              기재해 주세요.
            </p>
          )}
        </div>
      </div>

      <StepNavigation onPrev={onPrev} onNext={handleNext} isNextDisabled={!town.trim()} />
    </section>
  );
}
