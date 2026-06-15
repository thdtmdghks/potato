import type { AiService, AiServiceParams, AiResponse } from "./interface";
import { FallbackAiService } from "./fallback-service";
import { logError } from "../logger";
import { AI_CONFIG, BUSINESS } from "@/shared/constants";
import {
  getSystemInstruction,
  buildUserPrompt,
  sanitizeResponseField,
  parseBase64Image,
} from "./utils";

export class GeminiAiService implements AiService {
  private fallbackService = new FallbackAiService();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateDescription(params: AiServiceParams): Promise<AiResponse> {
    const { region, buildingType, categories, details, images } = params;

    try {
      const prompt = buildUserPrompt(params);

      const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [
        { text: prompt },
      ];

      // 이미지 데이터가 전달된 경우 Gemini inlineData 포맷으로 변환
      if (images && images.length > 0) {
        for (const img of images) {
          let mimeType = "image/jpeg";
          let base64Data = "";

          if (img.startsWith("data:")) {
            const parsed = parseBase64Image(img);
            if (parsed) {
              mimeType = parsed.mimeType;
              base64Data = parsed.base64Data;
            }
          } else if (img.startsWith("http")) {
            // 원격 URL인 경우 서버 측에서 fetch하여 base64로 가져옴
            try {
              const imgRes = await fetch(img);
              if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                base64Data = Buffer.from(arrayBuffer).toString("base64");
                const contentType = imgRes.headers.get("content-type");
                if (contentType) mimeType = contentType;
              }
            } catch (e) {
              logError("GeminiAiService.fetchRemoteImage", e, { url: img });
              continue;
            }
          }

          if (base64Data) {
            parts.push({
              inlineData: {
                mimeType,
                data: base64Data,
              },
            });
          }
        }
      }

      const modelName = process.env.GEMINI_MODEL || AI_CONFIG.DEFAULT_MODELS.GEMINI;
      const response = await fetch(
        `${AI_CONFIG.API_URLS.GEMINI}/${modelName}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts }],
            systemInstruction: {
              parts: [
                {
                  text: getSystemInstruction(),
                },
              ],
            },
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  proposals: {
                    type: "ARRAY",
                    description:
                      "서로 다른 톤앤매너와 초점을 가진 3가지 시공사례 설명글 및 추천 제목 세트.",
                    items: {
                      type: "OBJECT",
                      properties: {
                        description: {
                          type: "STRING",
                          description: `170자에서 200자 내외의 한국어 시공사례 설명글. 마지막 줄엔 반드시 줄바꿈 후 '- ${BUSINESS.name}' 서명이 단독으로 들어감.`,
                        },
                        suggestedTitle: {
                          type: "STRING",
                          description: "로컬 SEO 검색 노출을 위한 구체적인 시공사례 추천 제목.",
                        },
                      },
                      required: ["description", "suggestedTitle"],
                    },
                  },
                },
                required: ["proposals"],
              },
            },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        logError(
          "GeminiAiService.generateDescription",
          new Error(`Gemini API HTTP Error: ${response.status}`),
          { errText },
        );
        return this.fallbackService.generateDescription(params);
      }

      const data = await response.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!contentText) {
        return this.fallbackService.generateDescription(params);
      }

      try {
        const parsedRes = JSON.parse(contentText);
        const rawProposals = parsedRes.proposals || [];
        const proposals = rawProposals
          .map((p: any) => ({
            description: sanitizeResponseField(p.description),
            suggestedTitle: sanitizeResponseField(p.suggestedTitle),
          }))
          .slice(0, 3);

        if (proposals.length === 0) {
          const singleDesc = sanitizeResponseField(parsedRes.description);
          const singleTitle = sanitizeResponseField(parsedRes.suggestedTitle);
          if (singleDesc) {
            proposals.push({
              description: singleDesc,
              suggestedTitle: singleTitle,
            });
          }
        }

        if (proposals.length === 0) {
          return this.fallbackService.generateDescription(params);
        }

        return {
          success: true,
          description: proposals[0].description,
          suggestedTitle: proposals[0].suggestedTitle,
          proposals,
          isFallback: false,
        };
      } catch {
        return this.fallbackService.generateDescription(params);
      }
    } catch (error) {
      logError("GeminiAiService.generateDescription", error);
      return this.fallbackService.generateDescription(params);
    }
  }
}
