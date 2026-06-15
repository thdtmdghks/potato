import { useRef } from "react";

interface AiFeedbackPanelProps {
  initialDetails: string;
  onGenerateAi: (details: string, feedback?: string) => void;
  isGeneratingAi: boolean;
  compressing: boolean;
}

export function AiFeedbackPanel({
  initialDetails,
  onGenerateAi,
  isGeneratingAi,
  compressing,
}: AiFeedbackPanelProps) {
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLInputElement>(null);

  const handleRecreate = () => {
    const updatedDetails = detailsRef.current ? detailsRef.current.value.trim() : "";
    const feedback = feedbackRef.current ? feedbackRef.current.value.trim() : "";
    onGenerateAi(updatedDetails, feedback);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/20 p-4 transition-all dark:border-blue-900/30 dark:bg-blue-950/10">
      <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-400">
        <span>🤖 AI 수정 및 재생성 요청</span>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        기존에 입력한 자재 스펙을 직접 수정하거나, 추가 요구사항(피드백)을 반영하여 AI에게
        포트폴리오를 다시 작성하도록 요청할 수 있습니다.
      </p>

      <div className="space-y-2">
        <div>
          <label
            htmlFor="feedback-details"
            className="mb-1 block text-[10px] font-bold text-gray-500 dark:text-gray-400"
          >
            📋 자재 스펙 / 현장 특이사항 수정
          </label>
          <textarea
            id="feedback-details"
            ref={detailsRef}
            defaultValue={initialDetails}
            rows={2}
            placeholder="자재 사양이나 특이사항을 수정해 주세요."
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="feedback-prompt"
            className="mb-1 block text-[10px] font-bold text-gray-500 dark:text-gray-400"
          >
            💡 AI 추가 수정 요구사항 (피드백)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              id="feedback-prompt"
              ref={feedbackRef}
              placeholder="예: 조금 더 부드러운 일상 문체로 줄여서 써줘"
              className="h-10 w-full min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleRecreate}
              disabled={isGeneratingAi || compressing}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              🔄 재생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
