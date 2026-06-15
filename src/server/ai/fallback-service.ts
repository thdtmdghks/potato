import type { AiService, AiServiceParams, AiResponse } from "./interface";
import { CATEGORIES, BUSINESS } from "@/shared/constants";

export class FallbackAiService implements AiService {
  async generateDescription(params: AiServiceParams): Promise<AiResponse> {
    const { region, buildingType, categories, details } = params;

    const lines = [];
    if (region || buildingType || categories.length > 0) {
      const target = `${region || ""} ${buildingType || ""}`.trim();
      const cats = categories.join(", ");
      if (target && cats) {
        lines.push(`${target}에 ${cats} 시공.`);
      } else if (target) {
        lines.push(`${target} 시공.`);
      } else if (cats) {
        lines.push(`${cats} 시공.`);
      }
    }
    if (details.trim()) {
      lines.push(`${details.trim()}.`);
    }
    lines.push(`- ${BUSINESS.name}`);
    // 초안 1: 기본 정석 기술형
    const desc1 = [
      region || buildingType || categories.length > 0
        ? `${region || ""} ${buildingType || ""} ${categories.join(", ")} 시공 사례입니다.`
        : "",
      details.trim() ? `${details.trim()}.` : "",
      `- ${BUSINESS.name}`,
    ]
      .filter(Boolean)
      .join("\n");

    // 초안 2: 스펙 중심 요약형
    const desc2 = [
      `${region || "대구/경산"} 시공 현장 정보 요약.`,
      `시공 품목: ${categories.join(", ") || "창호"}`,
      details.trim() ? `작업 내용: ${details.trim()}.` : "",
      `- ${BUSINESS.name}`,
    ]
      .filter(Boolean)
      .join("\n");

    // 초안 3: 간결 기술 보고형
    const desc3 = [
      `[시공 완료] ${region || ""} ${buildingType || ""} 창호 공사 포트폴리오.`,
      details.trim()
        ? `${details.trim()} 작업을 성실하게 완료하였습니다.`
        : `${categories.join(", ")} 시공 완료.`,
      `- ${BUSINESS.name}`,
    ]
      .filter(Boolean)
      .join("\n");

    // 기본 추천 제목 생성 규칙 (우선순위에 따른 1개 대표 품목 매핑)
    let primaryCat = "";
    for (const p of CATEGORIES) {
      if (categories.includes(p)) {
        primaryCat = p;
        break;
      }
    }
    if (!primaryCat && categories.length > 0) {
      primaryCat = categories[0];
    }

    const parts = [];
    if (region) parts.push(region);
    if (buildingType) parts.push(buildingType);
    if (primaryCat) {
      parts.push(`${primaryCat} 시공`);
    } else {
      parts.push("시공사례");
    }
    const suggestedTitle1 = parts.join(" ").trim();
    const suggestedTitle2 = region
      ? `${region} ${primaryCat || "창호"} 교체 공사`
      : `${primaryCat || "창호"} 시공사례`;
    const suggestedTitle3 = `[시공완료] ${region || ""} ${buildingType || ""} ${primaryCat || "창호"}`;

    const proposals = [
      { description: desc1, suggestedTitle: suggestedTitle1 },
      { description: desc2, suggestedTitle: suggestedTitle2 },
      { description: desc3, suggestedTitle: suggestedTitle3 },
    ];

    return {
      success: true,
      description: desc1,
      suggestedTitle: suggestedTitle1,
      proposals,
      isFallback: true,
    };
  }
}
