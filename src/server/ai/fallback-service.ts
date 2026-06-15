import type { AiService, AiServiceParams, AiResponse } from "./interface";
import { CATEGORIES, BUSINESS } from "@/shared/constants";

export class FallbackAiService implements AiService {
  async generateDescription(params: AiServiceParams): Promise<AiResponse> {
    const { region, buildingType, categories, details } = params;

    const desc = [
      region || buildingType || categories.length > 0
        ? `${region || ""} ${buildingType || ""} ${categories.join(", ")} 시공 사례입니다.`
        : "",
      details.trim() ? `${details.trim()}.` : "",
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
    const suggestedTitle = parts.join(" ").trim();

    return {
      success: true,
      description: desc,
      suggestedTitle,
      isFallback: true,
    };
  }
}
