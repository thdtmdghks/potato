"use client";

import { Suspense } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/shared/routes";

function LoginContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isNotAdmin = searchParams.get("error") === "not-admin";
  const kakaoId = session?.kakaoId;

  return (
    <section className="w-full max-w-sm rounded-lg bg-white p-8 shadow dark:bg-gray-800">
      <h1 className="text-navy text-center text-2xl font-bold dark:text-white">로그인</h1>

      {isNotAdmin && kakaoId ? (
        <>
          <p className="mt-4 text-center text-sm text-red-500">관리자 권한이 없습니다.</p>
          <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-300">
            아래 카카오 ID를 관리자에게 전달해주세요.
          </p>
          <p className="bg-gray-light mt-2 rounded p-3 text-center font-mono text-lg dark:bg-gray-700 dark:text-white">
            {kakaoId}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hover:bg-gray-light mt-4 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-600 dark:hover:bg-gray-700"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-dark mt-2 text-center text-sm dark:text-gray-300">
            관리자 페이지에 접근하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() =>
              signIn("kakao", { callbackUrl: searchParams.get("callbackUrl") || "/admin" })
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.77 5.02 4.44 6.36-.14.52-.9 3.34-.93 3.55 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.6.09 1.23.13 1.88.13 5.52 0 10-3.36 10-7.5S17.52 3 12 3z"
                fill="currentColor"
              />
            </svg>
            카카오로 로그인
          </button>
        </>
      )}

      <p className="text-gray-dark mt-4 text-center text-xs dark:text-gray-400">
        <Link href={ROUTES.home} className="hover:text-navy underline dark:hover:text-blue-400">
          홈으로 돌아가기
        </Link>
      </p>
    </section>
  );
}

export default function Login() {
  return (
    <main className="bg-gray-light flex min-h-screen items-center justify-center px-4 dark:bg-gray-900">
      <Suspense>
        <LoginContent />
      </Suspense>
    </main>
  );
}
