import type { AiService } from "./interface";
import { GeminiAiService } from "./gemini-service";
import { OpenAiService } from "./openai-service";
import { FallbackAiService } from "./fallback-service";
import { AI_CONFIG } from "@/shared/constants";

let cachedAiService: AiService | null = null;

export const getAiService = (): AiService => {
  if (cachedAiService) {
    return cachedAiService;
  }

  const rawProvider = process.env.AI_PROVIDER;
  const provider =
    rawProvider && rawProvider !== "undefined" && rawProvider !== "null"
      ? rawProvider.toLowerCase().trim()
      : AI_CONFIG.PROVIDERS.GEMINI;

  const rawApiKey = process.env.AI_API_KEY;
  const apiKey =
    rawApiKey && rawApiKey !== "undefined" && rawApiKey !== "null" ? rawApiKey.trim() : "";

  if (!apiKey) {
    cachedAiService = new FallbackAiService();
    return cachedAiService;
  }

  const rawModel = process.env.AI_MODEL;
  const model = rawModel && rawModel !== "undefined" && rawModel !== "null" ? rawModel.trim() : "";

  if (provider === AI_CONFIG.PROVIDERS.OPENAI) {
    process.env.OPENAI_MODEL = model || AI_CONFIG.DEFAULT_MODELS.OPENAI;
    cachedAiService = new OpenAiService(apiKey);
  } else {
    process.env.GEMINI_MODEL = model || AI_CONFIG.DEFAULT_MODELS.GEMINI;
    cachedAiService = new GeminiAiService(apiKey);
  }

  return cachedAiService;
};

// 테스트 목적으로 캐시를 리셋할 수 있게 지원
export const resetCachedAiService = (): void => {
  cachedAiService = null;
};
