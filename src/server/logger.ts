import { env } from "@/shared/env";

const MAX_FIELD_LENGTH = 800;
const MAX_STACK_LINES = 12;

type DiscordEmbed = {
  title: string;
  color: number;
  timestamp: string;
  fields: { name: string; value: string; inline?: boolean }[];
};

// 백그라운드 디스코드 발송 (Non-blocking)
const sendToDiscord = async (webhookUrl: string, embed: DiscordEmbed) => {
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
};

/**
 * 스택 트레이스 가독성 정제 헬퍼
 * 에러 발생 지점의 핵심 정보(최대 12줄)를 표시하며, 디스코드 메시지 한도(1024자)를 넘지 않도록 제한합니다.
 */
const getSanitizedStack = (error: unknown): string | undefined => {
  if (!(error instanceof Error) || !error.stack) return undefined;
  const lines = error.stack.split("\n");
  const stack = lines.slice(0, MAX_STACK_LINES).join("\n");
  return stack.length > MAX_FIELD_LENGTH
    ? stack.slice(0, MAX_FIELD_LENGTH) + "\n... (아래 스택 생략됨)"
    : stack;
};

/**
 * 🔴 1. ERROR 레벨 로깅 (치명적인 서버/DB 장애용)
 */
export function logError(context: string, error: unknown, payload?: unknown) {
  const timestamp = new Date().toISOString();

  // 1. 콘솔 기본 출력
  console.error(`[ERROR] [${context}]`, error, payload);

  const webhookUrl = env.DISCORD_ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : JSON.stringify(error);
  const coreStack = getSanitizedStack(error);
  const nodeEnv = process.env.NODE_ENV?.toUpperCase() || "LOCAL";

  // 디스코드 카드 기본 구조 빌드
  const embed: DiscordEmbed = {
    title: `🔴 [${nodeEnv}] 시스템 장애 및 에러 발생`,
    color: 15158332, // Red (#E74C3C)
    timestamp,
    fields: [
      { name: "발생 위치 (Context)", value: `\`${context}\``, inline: true },
      { name: "에러 메시지", value: `\`\`\`\n${errorMessage}\n\`\`\`` },
    ],
  };

  // 객체 형태의 에러인 경우 추가 상세 필드 추출 (Supabase PostgrestError 등 대응)
  if (error && typeof error === "object") {
    const errObj = error as Record<string, unknown>;

    if (errObj.code) {
      embed.fields.push({ name: "에러 코드 (DB Code)", value: `\`${errObj.code}\``, inline: true });
    }
    if (errObj.status) {
      embed.fields.push({ name: "HTTP 상태 코드", value: `\`${errObj.status}\``, inline: true });
    }
    if (errObj.details && String(errObj.details).trim()) {
      embed.fields.push({
        name: "에러 상세 (Details)",
        value: `\`\`\`\n${errObj.details}\n\`\`\``,
      });
    }
    if (errObj.hint && String(errObj.hint).trim()) {
      embed.fields.push({ name: "힌트 (Hint)", value: `\`\`\`\n${errObj.hint}\n\`\`\`` });
    }

    // stack, message, code, status, details, hint를 제외한 나머지 정보가 있다면 포함
    try {
      const extra: Record<string, unknown> = {};
      for (const key of Object.getOwnPropertyNames(error)) {
        if (!["stack", "message", "code", "status", "details", "hint"].includes(key)) {
          extra[key] = errObj[key];
        }
      }
      if (Object.keys(extra).length > 0) {
        embed.fields.push({
          name: "상세 에러 객체 (Raw Error)",
          value: `\`\`\`json\n${JSON.stringify(extra, null, 2).slice(0, MAX_FIELD_LENGTH)}\n\`\`\``,
        });
      }
    } catch {
      // JSON stringify 에러 시 무시
    }
  }

  if (coreStack) {
    embed.fields.push({
      name: "스택 트레이스 (Stack Trace)",
      value: `\`\`\`\n${coreStack}\n\`\`\``,
    });
  }
  if (payload) {
    embed.fields.push({
      name: "시도 데이터 (Payload)",
      value: `\`\`\`json\n${JSON.stringify(payload, null, 2).slice(0, MAX_FIELD_LENGTH)}\n\`\`\``,
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
      value: `\`\`\`json\n${JSON.stringify(payload, null, 2).slice(0, MAX_FIELD_LENGTH)}\n\`\`\``,
    });
  }

  // 백그라운드 발송
  sendToDiscord(webhookUrl, embed);
}
