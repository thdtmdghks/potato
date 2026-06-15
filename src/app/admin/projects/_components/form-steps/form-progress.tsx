interface Step {
  id: number;
  label: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function FormProgress({ steps, currentStep, onStepClick }: FormProgressProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#121824]">
      <nav className="flex w-full items-center justify-between">
        {steps.map((s, idx) => {
          const isCurrent = currentStep === s.id;
          const isCompleted = currentStep > s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => {
                  if (s.id < currentStep) {
                    onStepClick(s.id);
                  }
                }}
                disabled={s.id >= currentStep}
                className={`flex cursor-pointer flex-col items-center gap-1 transition-all ${
                  isCurrent
                    ? "scale-105 font-bold text-blue-600 dark:text-blue-400"
                    : isCompleted
                      ? "font-semibold text-emerald-600 dark:text-emerald-400"
                      : "cursor-not-allowed text-gray-400 dark:text-gray-600"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    isCurrent
                      ? "dark:border-blue-450 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                      : isCompleted
                        ? "border-emerald-600 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "dark:border-gray-850 border-gray-200 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : s.id}
                </span>
                <span className="text-[10px] sm:text-xs">{s.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-all sm:mx-4 ${
                    currentStep > s.id ? "bg-emerald-500/60" : "bg-gray-250 dark:bg-gray-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </nav>
    </section>
  );
}
