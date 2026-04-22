import { NextResponse, type NextRequest } from "next/server";
import { createProxyAuth } from "@/lib/proxy-auth";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const auth = createProxyAuth(request, response);
  const user = await auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
