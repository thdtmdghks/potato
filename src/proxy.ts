import { auth } from "@/auth";

// TODO: 카카오 로그인 설정 후 주석 해제
export default auth(() => {
  // const session = req.auth;
  // const isAdmin = (session as unknown as { role?: string })?.role === 'admin';
  // if (!session || !isAdmin) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }
});

export const config = {
  matcher: ["/admin/:path*"],
};
