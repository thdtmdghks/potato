import { BUSINESS } from "@/shared/constants";
import type { AiServiceParams } from "./interface";

export const getSystemInstruction = (): string => {
  return `You are a professional architectural window and sash installation inspector and technical portfolio editor for '${BUSINESS.name}', based in Daegu and Gyeongsan. Write strictly in Korean. 
Your goal is to write high-quality, professional, and fact-based technical construction reports for client portfolios, not low-quality promotional blog posts. 

Strict Rules:
1. NEVER use generic marketing clichés, hyperbolic adjectives, or emotional sentences (e.g., "최고의 만족", "믿을 수 있는", "완벽한 시공", "친절한 상담", "고객님도 대만족").
2. NEVER use meaningless procedural/transitional filler text (e.g., "의뢰인의 요청에 따라", "문의를 주셔서", "상담 끝에", "방문하여"). Start directly with the technical core facts.
3. Link the selected construction items (sash, glass, screen) and technical details (e.g., wind draft, condensation, old frame) with logical building science explanations (e.g., how PVC frames improve airtightness, how double glazing prevents heat loss).
4. Maintain a dry, highly professional, and informative tone (~했습니다, ~작업했습니다).
5. NEVER exaggerate performance. Do not use unverified numbers or absolute statements (e.g., "냉방비 50% 절감", "소음 완벽 차단", "결로 100% 방지"). Use modest, factual expressions (e.g., "효율 증대에 기여", "소음 완화에 도움", "결로 현상 방지 완화").`;
};

export const buildUserPrompt = (params: AiServiceParams): string => {
  const { region, buildingType, categories, details } = params;
  return `아래 시공 정보와 첨부된 현장 사진을 분석하여, 검색 노출(SEO)에 최적화되고 전문 건축 포트폴리오처럼 신뢰감을 주는 시공 사례 설명글(description)과 추천 제목(suggestedTitle)을 작성해 줘.

[시공 정보]
- 시공 지역: ${region || "대구/경산 및 인근 지역"}
- 건물 유형: ${buildingType || "건물"}
- 시공 품목: ${categories.join(", ")}
- 세부 작업 및 현장 상황: ${details || "창호 시공"}

[작성 규칙]
1. description (시공 사례 본문):
   - 첫 문장은 반드시 "[시공 지역] [건물 유형] [시공 품목] 시공(또는 교체) 사례입니다." 형식으로 담백하게 시작해 줘.
   - 현장의 문제 원인(예: 알루미늄 샤시의 기밀성 저하, 외풍 유입, 노후화)과 해결 방법(선택한 품목 및 자재의 물리적 특성)을 건축 기술적으로 자연스럽게 연결해 줘.
   - 만약 시공 사진이 함께 제공되었다면, 사진에서 관찰되는 구체적 팩트(예: 프레임 색상인 화이트/블랙/브라운, 우레탄폼 단열 사춤 마감, 외부 조망 뷰, 실리콘 코킹 라인)를 직접 서술에 반영해 줘. 텍스트 정보에 명시되지 않았어도 사진 속 시각적 팩트를 찾아내 묘사하면 높은 가산점을 줘.
   - "고객 만족", "정성을 다하는", "완벽한 마무리" 같은 무의미한 미사여구나 감정 서술은 절대 사용하지 마.
   - 절대 성능을 과장하지 마. 검증되지 않은 수치나 확정적인 마케팅 문구(예: "냉방비 30% 절감", "외풍 완벽 차단", "결로 100% 방지")는 사용을 전면 금지하며, "효율 증대에 기여", "소음 완화에 도움", "단열 효과 보강"과 같은 보수적이고 객관적인 전문 용어 중심의 어휘를 사용해 줘.
   - 공백 포함 170자에서 200자 내외로 구성하고, 마지막 줄은 줄바꿈 후 반드시 "- ${BUSINESS.name}" 서명을 붙여 줘.

2. suggestedTitle (추천 제목):
   - 포맷: "[지역명] [건물유형] [구체적인 시공 품목/작업] 시공" (예: "경산 사동 전원주택 KCC 하이샤시 교체 및 이중창 시공")

[좋은 작성 예시]
- 입력: 경산 빌라, 유리, 24mm 로이그린유리 적용, (화이트 프레임 건물 외관 사진 첨부)
- 출력: "경산 백천동 빌라 유리 시공 사례입니다. 건물 외부에 24mm 로이그린유리를 적용하여 시공했습니다. 로이코팅은 열 손실을 줄이고 그린 색상의 외관은 외부 햇빛을 효과적으로 차단하여 실내 냉난방 효율 증대에 기여합니다. 사진에서 보이는 바와 같이 화이트 프레임과 함께 건물의 현대적인 외관에 맞춰 시공되었습니다.\n- ${BUSINESS.name}"`;
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
