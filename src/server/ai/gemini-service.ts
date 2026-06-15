import type { AiService, AiServiceParams, AiResponse } from "./interface";
import { FallbackAiService } from "./fallback-service";
import { logError, logWarn } from "../logger";
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
    const { images } = params;
    let isImageSkipped = false;

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
                const buffer = Buffer.from(arrayBuffer);
                // 2중 방어 장치: fetch한 원격 이미지 파일이 150KB를 초과하는 대용량일 경우, 제미나이 503 에러 방지를 위해 AI 분석에서 제외함
                if (buffer.length > 150 * 1024) {
                  logWarn(
                    "GeminiAiService.generateDescription",
                    `원격 이미지 용량이 너무 커서 AI 이미지 분석을 건너뛰었습니다. (용량: ${Math.round(buffer.length / 1024)}KB)`,
                    {
                      url: img,
                      sizeBytes: buffer.length,
                      clientMetadata: params.metadata,
                    },
                  );
                  isImageSkipped = true;
                  continue;
                }
                base64Data = buffer.toString("base64");
                const contentType = imgRes.headers.get("content-type");
                if (contentType) mimeType = contentType;
              } else {
                isImageSkipped = true;
              }
            } catch (e) {
              logError("GeminiAiService.fetchRemoteImage", e, { url: img });
              isImageSkipped = true;
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
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        logError(
          "GeminiAiService.generateDescription",
          new Error(`Gemini API HTTP Error: ${response.status}`),
          { errText, clientMetadata: params.metadata },
        );
        const fallbackRes = await this.fallbackService.generateDescription(params);
        return { ...fallbackRes, isImageSkipped };
      }

      const data = await response.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!contentText) {
        logWarn(
          "GeminiAiService.generateDescription",
          "Gemini API 응답 본문 파싱 실패로 기본 텍스트 조립본으로 대체하여 반환합니다.",
          { clientMetadata: params.metadata },
        );
        const fallbackRes = await this.fallbackService.generateDescription(params);
        return { ...fallbackRes, isImageSkipped };
      }

      try {
        const parsedRes = JSON.parse(contentText);
        const description = sanitizeResponseField(parsedRes.description);
        const suggestedTitle = sanitizeResponseField(parsedRes.suggestedTitle);

        if (!description) {
          const fallbackRes = await this.fallbackService.generateDescription(params);
          return { ...fallbackRes, isImageSkipped };
        }

        return {
          success: true,
          description,
          suggestedTitle: suggestedTitle || "",
          isFallback: false,
          isImageSkipped,
        };
      } catch {
        const fallbackRes = await this.fallbackService.generateDescription(params);
        return { ...fallbackRes, isImageSkipped };
      }
    } catch (error) {
      logError("GeminiAiService.generateDescription", error);
      const fallbackRes = await this.fallbackService.generateDescription(params);
      return { ...fallbackRes, isImageSkipped };
    }
  }
}
