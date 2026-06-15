import { BUSINESS, AI_GOOD_EXAMPLE } from "@/shared/constants";
import type { AiServiceParams } from "./interface";

export const getSystemInstruction = (): string => {
  return `You are a professional architectural window and sash installation inspector and technical portfolio editor for '${BUSINESS.name}', based in Daegu and Gyeongsan. Write strictly in Korean. 
Your goal is to write high-quality, professional, yet natural and down-to-earth contractor portfolio notes, not rigid research papers or low-quality promotional blog posts.

Strict Rules:
1. NEVER use generic marketing clichés, hyperbolic adjectives, emotional sentences, or subjective design/aesthetic opinions (e.g., "최고의 만족", "완벽한 시공", "외관과 조화롭다", "세련되고 현대적인 외형", "깔끔하고 보기 좋다").
2. NEVER use meaningless procedural/transitional filler text (e.g., "의뢰인의 요청에 따라", "문의를 주셔서", "상담 끝에", "방문하여"). Start directly with the technical core facts.
3. Link the selected construction items (sash, glass, screen) and technical details (e.g., wind draft, condensation, old frame) with logical building science explanations.
4. Use a natural, everyday contractor tone (~했습니다, ~해드렸습니다). Avoid stiff academic, research-style, or textbook jargon (e.g., "~에 기여하도록 작업했습니다", "에너지 효율 증대", "기밀성 향상"). Instead, write in an everyday practical way that actual window installers use (e.g., "바람을 잘 막아주도록 교체했습니다", "단열을 보강해 드렸습니다", "소음을 부드럽게 완화했습니다").
5. NEVER write textbook-style or dictionary-like general explanations about window or sash materials (e.g., "PVC 샤시는 단열 성능 향상에 기여합니다", "복층유리는 냉난방 효율을 올립니다"). Only describe the concrete actions and physical details unique to this specific construction site.
6. NEVER exaggerate performance. Do not use unverified numbers or absolute statements (e.g., "냉방비 50% 절감", "소음 완벽 차단", "결로 100% 방지"). Use modest, factual, and natural expressions (e.g., "바람과 추위를 더 잘 막아주도록", "소음을 줄여 조용하도록", "단열을 튼튼하게 보강").
7. Keep the description extremely concise and straightforward (strictly within 2-3 sentences). Focus only on the essential work done without any fluff.`;
};

export const buildUserPrompt = (params: AiServiceParams): string => {
  const { region, buildingType, categories, details } = params;
  return `아래 시공 정보와 첨부된 현장 사진을 분석하여, 검색 노출(SEO)에 최적화되고 전문 창호 시공업체의 신뢰감을 주는 시공 사례 설명글(description)과 추천 제목(suggestedTitle)을 작성해 줘.

[시공 정보]
- 시공 지역: ${region || "대구/경산 및 인근 지역"}
- 건물 유형: ${buildingType || "건물"}
- 시공 품목: ${categories.join(", ")}
- 세부 작업 및 현장 상황: ${details || "창호 시공"}

[작성 규칙]
1. description (시공 사례 본문):
   - 첫 문장은 반드시 "[시공 지역] [건물 유형] [시공 품목] 시공(또는 교체) 사례입니다." 형식으로 담백하게 시작해 줘.
   - 현장의 구체적 상황(사용자가 입력한 세부 작업 및 현장 상황)과 실제 취한 시공 조치만을 자연스럽게 설명해 줘.
   - 문체는 억지로 격식을 갖춘 딱딱한 문어체(예: "단열 향상에 기여하도록 작업했다", "기밀성을 증대시켰다") 대신, 전문성과 신뢰감을 유지하면서도 현장 시공사들이 일상적으로 작성하는 친근한 실무 팩트체(예: "틈새 바람을 꽉 막아주도록 마감했다", "단열을 더 튼튼하게 보강해 드렸다", "소음을 줄여 더 아늑하도록 교체했다")로 작성해 줘.
   - 문장을 장황하게 늘리지 말고, 2~3문장 이내로 아주 간결하고 간단하게 작성해 줘. 팩트 중심으로 축약하여 공백 포함 120자에서 160자 내외의 담백한 본문으로 마감해 줘. 마지막 줄은 줄바꿈 후 반드시 "- ${BUSINESS.name}" 서명을 붙여 줘.
   - 만약 시공 사진이 함께 제공되었다면, 사진에서 관찰되는 구체적 팩트(예: 프레임 색상인 화이트/블랙/브라운, 우레탄폼 단열 사춤 마감, 외부 조망 뷰, 실리콘 코킹 라인)를 직접 서술에 반영해 줘. 텍스트 정보에 명시되지 않았어도 사진 속 시각적 팩트를 찾아내 묘사하면 높은 가산점을 줘.
   - "고객 만족", "완벽한 마무리", "외관과 조화롭다", "깔끔하고 세련된" 같은 무의미한 미사여구, 주관적인 심미적 감상이나 사견은 절대 사용하지 마.
   - 절대 성능을 과장하거나 자재의 교과서적인 특징(예: "PVC 샤시는 온도를 유지하고 냉난방 효율에 도움을 줍니다")을 기재하지 마. 오직 이 현장 고유의 팩트 및 시공 조치 사실만을 서술해 줘.

2. suggestedTitle (추천 제목):
   - 포맷: "[지역명] [건물유형] [구체적인 시공 품목/작업] 시공" (예: "경산 사동 전원주택 KCC 하이샤시 교체 및 이중창 시공")

[좋은 작성 예시]
- 입력: ${AI_GOOD_EXAMPLE.INPUT}
- 출력: "${AI_GOOD_EXAMPLE.OUTPUT_WITH_SIGNATURE}"`;
};

export const sanitizeResponseField = (val: string): string => {
  let clean = (val || "").trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  return clean;
};

export const parseBase64Image = (img: string): { mimeType: string; base64Data: string } | null => {
  if (!img.startsWith("data:")) return null;
  const commaIdx = img.indexOf(",");
  if (commaIdx === -1) return null;

  const meta = img.substring(0, commaIdx); // e.g. "data:image/webp;base64"
  const base64Data = img.substring(commaIdx + 1);

  let mimeType = "image/jpeg";
  const mimeMatch = meta.match(/data:([^;]+);/);
  if (mimeMatch) {
    mimeType = mimeMatch[1];
  }

  return { mimeType, base64Data };
};
