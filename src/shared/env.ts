import { z } from "zod/v4";

// 환경변수 스키마 정의
const envSchema = z.object({
  // Supabase (Server-only) — SUPABASE_URL 미설정 시 Mock 모드로 동작
  SUPABASE_URL: z.url("SUPABASE_URL이 유효한 URL 형식이 아닙니다.").optional(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY가 누락되었습니다.")
    .optional(),

  // 관리자 카카오 계정 ID 화이트리스트 (포맷: "ID:이름,ID2:이름2")
  ADMIN_KAKAO_IDS: z
    .string()
    .regex(
      /^(\d+:\S+)(,\d+:\S+)*$/,
      "ADMIN_KAKAO_IDS 포맷이 올바르지 않습니다. (예: 123456:홍길동,789012:김철수)",
    ),

  // Auth.js / NextAuth
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET 환경변수가 설정되지 않았습니다."),
  AUTH_KAKAO_ID: z.string().min(1, "AUTH_KAKAO_ID 환경변수가 설정되지 않았습니다."),
  AUTH_KAKAO_SECRET: z.string().min(1, "AUTH_KAKAO_SECRET 환경변수가 설정되지 않았습니다."),

  // 디스코드 실시간 모니터링 알림 웹훅
  DISCORD_ERROR_WEBHOOK_URL: z.url("DISCORD_ERROR_WEBHOOK_URL이 유효한 URL 형식이 아닙니다."),
  DISCORD_WARN_WEBHOOK_URL: z.url("DISCORD_WARN_WEBHOOK_URL이 유효한 URL 형식이 아닙니다."),
});

// 환경변수 파싱 및 검증
let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_KAKAO_IDS: process.env.ADMIN_KAKAO_IDS,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_KAKAO_ID: process.env.AUTH_KAKAO_ID,
    AUTH_KAKAO_SECRET: process.env.AUTH_KAKAO_SECRET,
    DISCORD_ERROR_WEBHOOK_URL: process.env.DISCORD_ERROR_WEBHOOK_URL,
    DISCORD_WARN_WEBHOOK_URL: process.env.DISCORD_WARN_WEBHOOK_URL,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");
    console.error(
      `\n❌ [환경변수 검증 실패] 올바르지 않은 환경변수 설정이 감지되었습니다:\n${formattedErrors}\n`,
    );
  }

  process.exit(1);
}

export const env = parsedEnv;
