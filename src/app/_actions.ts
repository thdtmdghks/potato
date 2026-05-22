"use server";

import { logError } from "@/server/logger";
import { headers } from "next/headers";

/**
 * 클라이언트 및 렌더링 에러를 수집해 서버 로거로 포워딩하는 액션
 */
export async function reportUnexpectedError(message: string, stack?: string) {
  const reqHeaders = await headers();
  const userAgent = reqHeaders.get("user-agent") || "unknown";
  const referer = reqHeaders.get("referer") || "unknown";
  const ip = reqHeaders.get("x-forwarded-for") || "unknown";

  // 에러 객체 가상화 생성
  const errorObj = new Error(message);
  if (stack) {
    errorObj.stack = stack;
  }

  logError("ClientBoundary", errorObj, {
    userAgent,
    referer,
    ip,
  });
}
