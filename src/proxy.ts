import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const session = req.auth;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session.role !== "admin") {
    return NextResponse.redirect(new URL("/login?error=not-admin", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
