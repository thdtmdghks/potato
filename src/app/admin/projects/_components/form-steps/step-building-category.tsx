import type { UseFormReturn } from "react-hook-form";
import type { ProjectFormData } from "@/shared/schemas";
import { Label } from "@/app/_components/label";
import { CATEGORIES, BUILDING_TYPES } from "@/shared/constants";
import { StepNavigation } from "./step-navigation";

interface StepBuildingCategoryProps {
  form: UseFormReturn<ProjectFormData>;
  onNext: () => void;
  onPrev: () => void;
}

const BUILDING_TYPE_ICONS: Record<string, string> = {
  아파트: "🏢",
  빌라: "🏡",
  단독주택: "🏠",
  상가: "🏪",
  기타: "🛠️",
};

export function StepBuildingCategory({ form, onNext, onPrev }: StepBuildingCategoryProps) {
  const { register, watch } = form;
  const watchedBuildingType = watch("building_type") || "";
  const watchedCategories = watch("categories") || [];

  return (
    <section className="animate-fade-in space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all md:p-6 dark:border-gray-800 dark:bg-[#121824]">
      <div className="border-b border-gray-50 pb-3 dark:border-gray-800">
        <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
          🏢 3단계: 현장 유형 및 시공 품목
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          어떤 종류의 건물에 어떤 작업을 진행하셨는지 고르세요.
        </p>
      </div>

      <div className="space-y-5">
        {/* 건물 유형 */}
        <div className="space-y-2.5">
          <Label className="text-gray-755 text-sm font-semibold dark:text-gray-200">
            건물 유형 선택
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {BUILDING_TYPES.map((opt) => {
              const isSelected = watchedBuildingType === opt;
              const icon = BUILDING_TYPE_ICONS[opt] || "🛠️";
              return (
                <label
                  key={opt}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all select-none active:scale-[0.97] ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/20 font-bold text-blue-600 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
                      : "border-gray-150 text-gray-655 dark:border-gray-855 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/40"
                  }`}
                >
                  <input
                    type="radio"
                    value={opt}
                    checked={isSelected}
                    {...register("building_type")}
                    className="sr-only"
                  />
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs font-bold">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 시공 품목 */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-800/60">
          <Label className="text-gray-755 text-sm font-semibold dark:text-gray-200">
            시공 품목 선택 (다중 선택 가능)
          </Label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const isChecked = watchedCategories?.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex cursor-pointer items-center justify-start gap-3 rounded-xl border p-3.5 transition-all select-none active:scale-[0.98] ${
                    isChecked
                      ? "border-blue-600 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-950/20"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={cat}
                    {...register("categories")}
                    className="dark:border-gray-650 dark:bg-gray-855 h-4.5 w-4.5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{cat}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <StepNavigation
        onPrev={onPrev}
        onNext={onNext}
        isNextDisabled={!watchedBuildingType || watchedCategories.length === 0}
      />
    </section>
  );
}
