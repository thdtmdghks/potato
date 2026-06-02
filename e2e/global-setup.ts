import { readFileSync } from "fs";
import { resolve } from "path";

const globalSetup = () => {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    const hasSupabaseUrl = content
      .split("\n")
      .some((line) => line.startsWith("SUPABASE_URL=") && !line.startsWith("#"));

    if (hasSupabaseUrl) {
      console.error("\n❌ [E2E 안전장치] .env.local에 SUPABASE_URL이 설정되어 있습니다.");
      console.error("   E2E 테스트는 Mock Repository로 실행해야 합니다.");
      console.error(
        "   .env.local에서 SUPABASE_URL을 주석 처리하거나 삭제한 후 다시 실행하세요.\n",
      );
      process.exit(1);
    }
  } catch {
    // .env.local 없으면 OK (Mock 모드)
  }
};

export default globalSetup;
