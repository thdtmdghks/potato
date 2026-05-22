import { env } from "@/shared/env";

type DiscordEmbed = {
  title: string;
  color: number;
  timestamp: string;
  fields: { name: string; value: string; inline?: boolean }[];
};

// 백그라운드 디스코드 발송 (Non-blocking)
async function sendToDiscord(webhookUrl: string, embed: DiscordEmbed) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!response.ok) {
      console.warn(`[DISCORD LOGGING FAILED] Status: ${response.status}`);
    }
  } catch (err) {
    console.warn("[DISCORD LOGGING SYSTEM ERROR]", err);
  }
}

/**
 * 스택 트레이스 가독성 정제 헬퍼
 * 첫 5~8줄의 핵심 프로젝트 소스 관련 경로만 파싱하여 디스코드 메시지 한도 초과를 방지합니다.
 */
function getSanitizedStack(error: unknown): string | undefined {
  if (!(error instanceof Error) || !error.stack) return undefined;
  const lines = error.stack.split("\n");
  const filteredLines = lines
    .filter((line) => line.includes("src/") || line.includes("app/") || line.includes("server/"))
    .slice(0, 8);

  if (filteredLines.length === 0) {
    return lines.slice(0, 5).join("\n");
  }
  return filteredLines.join("\n");
}

/**
 * 🔴 1. ERROR 레벨 로깅 (치명적인 서버/DB 장애용)
 */
export function logError(context: string, error: unknown, payload?: unknown) {
  const timestamp = new Date().toISOString();

  // 1. 콘솔 기본 출력
  console.error(`[ERROR] [${context}]`, error, payload);

  const webhookUrl = env.DISCORD_ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const coreStack = getSanitizedStack(error);
  const nodeEnv = process.env.NODE_ENV?.toUpperCase() || "LOCAL";

  // 디스코드 카드 빌드
  const embed: DiscordEmbed = {
    title: `🔴 [${nodeEnv}] 시스템 장애 및 에러 발생`,
    color: 15158332, // Red (#E74C3C)
    timestamp,
    fields: [
      { name: "발생 위치 (Context)", value: `\`${context}\``, inline: true },
      { name: "에러 메시지", value: `\`\`\`\n${errorMessage}\n\`\`\`` },
    ],
  };

  if (coreStack) {
    embed.fields.push({ name: "핵심 스택 트레이스", value: `\`\`\`\n${coreStack}\n\`\`\`` });
  }
  if (payload) {
    embed.fields.push({
      name: "시도 데이터 (Payload)",
      value: `\`\`\`json\n${JSON.stringify(payload, null, 2).slice(0, 800)}\n\`\`\``,
    });
  }

  // 백그라운드 발송 (await 미사용하여 응답 속도 보존)
  sendToDiscord(webhookUrl, embed);
}

/**
 * 🟡 2. WARN 레벨 로깅 (보안 및 경고 이벤트용)
 */
export function logWarn(context: string, message: string, payload?: unknown) {
  const timestamp = new Date().toISOString();

  // 1. 콘솔 기본 출력
  console.warn(`[WARN] [${context}] ${message}`, payload);

  const webhookUrl = env.DISCORD_WARN_WEBHOOK_URL;
  if (!webhookUrl) return;

  const nodeEnv = process.env.NODE_ENV?.toUpperCase() || "LOCAL";

  const embed: DiscordEmbed = {
    title: `🟡 [${nodeEnv}] 보안 감지 및 경고 알림`,
    color: 15105570, // Orange (#E67E22)
    timestamp,
    fields: [
      { name: "감지 위치 (Context)", value: `\`${context}\``, inline: true },
      { name: "경고 내용", value: message },
    ],
  };

  if (payload) {
    embed.fields.push({
      name: "관련 데이터 (Payload)",
      value: `\`\`\`json\n${JSON.stringify(payload, null, 2).slice(0, 800)}\n\`\`\``,
    });
  }

  // 백그라운드 발송
  sendToDiscord(webhookUrl, embed);
}
