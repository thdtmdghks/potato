interface StepNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextType?: "button" | "submit";
}

export function StepNavigation({
  onPrev,
  onNext,
  nextLabel = "다음 단계로 ➔",
  prevLabel = "◀ 이전으로",
  isNextDisabled = false,
  isSubmitting = false,
  nextType = "button",
}: StepNavigationProps) {
  return (
    <div className="dark:border-gray-855 mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
      {onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="dark:hover:text-gray-350 text-xs font-bold text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400"
        >
          {prevLabel}
        </button>
      ) : (
        <div /> // 균형 정렬을 위한 빈 공간
      )}

      {onNext || nextType === "submit" ? (
        <button
          type={nextType}
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          className="bg-navy hover:bg-navy-light inline-flex h-12 items-center justify-center gap-1.5 rounded-xl px-6 text-sm font-bold text-white shadow-md transition-all active:scale-98 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {isSubmitting ? "저장 중..." : nextLabel}
        </button>
      ) : null}
    </div>
  );
}
