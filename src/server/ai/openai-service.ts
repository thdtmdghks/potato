import type { AiService, AiServiceParams, AiResponse } from "./interface";
import { FallbackAiService } from "./fallback-service";
import { logError } from "../logger";
import { AI_CONFIG } from "@/shared/constants";
import { getSystemInstruction, buildUserPrompt, sanitizeResponseField } from "./utils";

export class OpenAiService implements AiService {
  private fallbackService = new FallbackAiService();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateDescription(params: AiServiceParams): Promise<AiResponse> {
    const { region, buildingType, categories, details, images } = params;

    try {
      const prompt = buildUserPrompt(params);

      const userContent: (
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      )[] = [{ type: "text", text: prompt }];

      if (images && images.length > 0) {
        for (const img of images) {
          const url = img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
          userContent.push({
            type: "image_url",
            image_url: {
              url,
            },
          });
        }
      }

      const modelName = process.env.OPENAI_MODEL || AI_CONFIG.DEFAULT_MODELS.OPENAI;
      const response = await fetch(AI_CONFIG.API_URLS.OPENAI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                getSystemInstruction() +
                " You must respond in a valid JSON object matching the requested format.",
            },
            {
              role: "user",
              content: userContent,
            },
          ],
          max_tokens: AI_CONFIG.PARAMETERS.MAX_TOKENS,
          temperature: AI_CONFIG.PARAMETERS.TEMPERATURE,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        logError(
          "OpenAiService.generateDescription",
          new Error(`OpenAI API HTTP Error: ${response.status}`),
          { errText },
        );
        return this.fallbackService.generateDescription(params);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        return this.fallbackService.generateDescription(params);
      }

      try {
        const parsedRes = JSON.parse(content);
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
      logError("OpenAiService.generateDescription", error);
      return this.fallbackService.generateDescription(params);
    }
  }
}
