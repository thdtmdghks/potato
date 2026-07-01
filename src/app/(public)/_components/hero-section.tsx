import {
  AppWindow,
  Grid,
  Sparkles,
  DoorClosed,
  Shield,
  Wrench,
  Flame,
  Construction,
  Layers,
} from "lucide-react";
import { BUSINESS, CATEGORIES } from "@/shared/constants";

const HERO_BADGES = [
  { emoji: "⚡", label: `${BUSINESS.region} 당일 시공` },
  { emoji: "🏆", label: "LX, KCC, 예림 자재" },
  { emoji: "🏅", label: "풍부한 경험" },
  { emoji: "🔧", label: "확실한 A/S" },
  { emoji: "💯", label: "꼼꼼한 공사" },
] as const;

const CATEGORY_ICONS: Record<
  (typeof CATEGORIES)[number],
  React.ComponentType<{ className?: string }>
> = {
  하이샤시: AppWindow,
  방충망: Grid,
  유리: Sparkles,
  ABS도어: DoorClosed,
  방범창: Shield,
  잡철: Wrench,
  방화문: Flame,
  스텐: Construction,
  판넬: Layers,
};

export function HeroSection() {
  return (
    <section className="from-navy to-navy-light bg-gradient-to-br py-16 text-center text-white md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold md:text-5xl">{BUSINESS.slogan}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
          하이샤시, 방충망, 유리 교체부터 ABS도어, 방화문, 판넬, 잡철 및 스텐 공사까지!
          <br className="hidden sm:inline" />
          경산 대구 지역의 창호 및 종합 금속·잡철 시공을 확실하게 책임집니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {HERO_BADGES.map(({ emoji, label }) => (
            <span
              key={label}
              className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm"
            >
              {emoji} {label}
            </span>
          ))}
        </div>

        {/* 시공 품목 그리드 */}
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <p className="text-accent mb-4 text-xs font-bold tracking-wider uppercase">
            전문 시공 품목
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <div
                  key={cat}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/5 px-2 py-3.5 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:shadow-lg"
                >
                  <Icon className="text-accent mb-2 h-5 w-5" />
                  <span className="text-[11px] font-semibold text-gray-200 md:text-xs">{cat}</span>
                </div>
              );
            })}
          </div>
        </div>

        <a
          href="#contact"
          className="bg-accent hover:bg-accent-dark mt-10 inline-block rounded-lg px-8 py-3 text-lg font-bold text-white transition-colors"
        >
          📞 상담·견적 문의하기
        </a>
      </div>
    </section>
  );
}
