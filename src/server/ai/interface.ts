import type { AiResponse, AiServiceParams } from "@/shared/types";

export type { AiResponse, AiServiceParams };

export interface AiService {
  generateDescription(params: AiServiceParams): Promise<AiResponse>;
}
