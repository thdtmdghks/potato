import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logWarn } from "@/server/logger";

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  if (!session) {
    // 비로그인 상태 접근 감지 및 보안 경고 전송
    logWarn("Middleware.Auth", "비로그인 사용자의 관리자 영역 진입 시도", {
      url: path,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    const callbackUrl = encodeURIComponent(path + req.nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  if (session.role !== "admin") {
    // 권한 없는 로그인 상태 접근 감지 및 보안 경고 전송
    logWarn("Middleware.Auth", "권한 없는 사용자의 관리자 영역 진입 시도", {
      url: path,
      kakaoId: session.kakaoId,
      role: session.role,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    return NextResponse.redirect(new URL("/login?error=not-admin", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
