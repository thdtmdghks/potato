import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function proxy() {
  const session = await auth();

  // /admin/* 경로는 인증 필요
  if (!session) {
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
