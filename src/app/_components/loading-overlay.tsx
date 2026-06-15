interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
}

export function LoadingOverlay({
  isVisible,
  title = "작업 처리 중...",
  description = "잠시만 기다려 주세요.",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      id="loading-overlay"
      className="bg-navy/60 animate-fade-in fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md transition-all dark:bg-black/70"
    >
      <div className="mx-4 w-full max-w-sm space-y-4 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-2xl dark:border-gray-800 dark:bg-[#121824]">
        <div className="flex justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-navy text-base font-bold dark:text-white">{title}</h3>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
