import { useRef } from "react";
import { Label } from "@/app/_components/label";
import { Input } from "@/app/_components/input";
import { StepNavigation } from "./step-navigation";
import { AI_GOOD_EXAMPLE } from "@/shared/constants";

interface StepDetailsProps {
  initialDetails: string;
  onGenerateAi: (details: string) => void;
  onNext: (details: string) => void;
  onPrev: () => void;
  isGeneratingAi: boolean;
  compressing: boolean;
}

const QUICK_TAGS = [
  "KCC 하이샤시 교체",
  "24mm 로이복층유리",
  "노후 샤시 철거 및 교체",
  "우레탄폼 단열 사춤 마감",
  "미세방충망 교체",
];

export function StepDetails({
  initialDetails,
  onGenerateAi,
  onNext,
  onPrev,
  isGeneratingAi,
  compressing,
}: StepDetailsProps) {
  const detailsRef = useRef<HTMLInputElement>(null);

  const handleAddQuickTag = (tag: string) => {
    if (!detailsRef.current) return;
    const current = detailsRef.current.value.trim();
    if (
      current
        .split(", ")
        .map((t) => t.trim())
        .includes(tag)
    ) {
      return; // 이미 있으면 추가 안 함
    }
    const newVal = current ? `${current}, ${tag}` : tag;
    detailsRef.current.value = newVal;
  };

  const handleGenerate = () => {
    const currentVal = detailsRef.current ? detailsRef.current.value.trim() : "";
    onGenerateAi(currentVal);
  };

  const handleNext = () => {
    const currentVal = detailsRef.current ? detailsRef.current.value.trim() : "";
    onNext(currentVal);
  };

  return (
    <section className="animate-fade-in space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all md:p-6 dark:border-gray-800 dark:bg-[#121824]">
      <div className="border-b border-gray-50 pb-3 dark:border-gray-800">
        <h2 className="text-navy flex items-center gap-2 text-lg font-bold dark:text-white">
          ⚡ 4단계: 현장 스펙 및 특이사항 작성
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          노후 창호 철거 여부나 하이샤시 유리 사양 등 특징적인 부분을 탭하여 입력해 주세요. 작성 후
          AI 완성 버튼을 누르시면 됩니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label
            htmlFor="details-input"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            자재 스펙 / 현장 특이사항
          </Label>

          <div className="space-y-3.5 rounded-2xl border border-blue-100 bg-blue-50/40 p-4.5 transition-all dark:border-blue-900/30 dark:bg-blue-950/10">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-400">
              <span>💡 고품질 포트폴리오를 위한 AI 작성 팁</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
              AI가 단순한 자재 일반론에서 벗어나 <b>현장 중심의 담백하고 신뢰감 높은 포트폴리오</b>
              를 작성할 수 있도록 <b>&quot;현장 문제&quot;</b>와 <b>&quot;시공 내역&quot;</b>을 함께
              기입해 주세요. (자재설명이나 주관적 미사여구는 AI가 자동으로 배제합니다.)
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5 rounded-xl border border-blue-50/50 bg-white/70 p-3 text-[11px] dark:border-blue-900/10 dark:bg-gray-900/50">
                <span className="block font-bold text-gray-700 dark:text-gray-300">
                  📝 권장하는 키워드 조합:
                </span>
                <ul className="text-gray-650 list-inside list-disc space-y-1 dark:text-gray-400">
                  <li>
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      외풍 심한 거실
                    </code>{" "}
                    +{" "}
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      KCC 하이샤시 교체
                    </code>
                  </li>
                  <li>
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      도로 소음 심함
                    </code>{" "}
                    +{" "}
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      24mm 로이복층유리
                    </code>
                  </li>
                  <li>
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      냉방비 부담 및 강한 햇빛
                    </code>{" "}
                    +{" "}
                    <code className="dark:text-blue-450 rounded bg-blue-50/30 px-1 py-0.5 font-semibold text-blue-700">
                      로이그린유리 적용
                    </code>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 rounded-xl border border-blue-100/50 bg-white p-3 text-[11px] shadow-sm dark:border-blue-900/20 dark:bg-gray-950">
                <span className="block font-bold text-blue-800 dark:text-blue-400">
                  🌟 좋은 작성 및 변환 예시:
                </span>
                <div className="space-y-1.5 text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="text-gray-755 font-bold dark:text-gray-300">
                      ✍️ 관리자 입력:
                    </span>
                    <p className="mt-0.5 rounded bg-gray-50 px-1.5 py-1 font-mono text-[10px] text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                      {AI_GOOD_EXAMPLE.INPUT}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      🤖 AI 최종 본문:
                    </span>
                    <p className="mt-0.5 rounded bg-emerald-50/30 px-1.5 py-1 text-[10px] leading-relaxed text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                      &quot;{AI_GOOD_EXAMPLE.OUTPUT_WITHOUT_SIGNATURE}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Input
            id="details-input"
            ref={detailsRef}
            placeholder="직접 입력하시거나 아래 추천 퀵 칩을 눌러 조합해 보세요."
            defaultValue={initialDetails}
            className="h-12 w-full rounded-xl border-gray-200 px-4 text-base transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <span className="dark:text-gray-555 block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            ⚡ 자주 쓰이는 시공 사양 (탭하여 즉시 추가)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddQuickTag(tag)}
                className="text-gray-655 dark:bg-gray-850 dark:hover:bg-gray-750 inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold transition-all hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600 active:scale-95 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI 완성 패널 내장 */}
      <div className="space-y-3 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-50/20 to-teal-50/10 p-4.5 dark:border-emerald-500/15 dark:from-emerald-950/10 dark:to-teal-950/5">
        <span className="dark:text-emerald-450 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
          🤖 AI 자동 제목/설명 생성
        </span>
        <p className="text-[11px] leading-relaxed text-emerald-800/70 dark:text-emerald-400/60">
          지금까지 입력하신 시공사례 사진, 위치, 품목 정보를 바탕으로 네이버/구글 상위 노출에
          최적화된 매력적인 포트폴리오를 AI가 1초 만에 구성해 줍니다.
        </p>

        <button
          type="button"
          disabled={isGeneratingAi || compressing}
          onClick={handleGenerate}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          {isGeneratingAi ? (
            <>
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              인공지능 분석 및 본문 생성 중...
            </>
          ) : (
            <>
              <span>✨ AI 분석 및 자동완성 ➔</span>
            </>
          )}
        </button>
      </div>

      <StepNavigation onPrev={onPrev} onNext={handleNext} nextLabel="직접 검토하기 ➔" />
    </section>
  );
}
