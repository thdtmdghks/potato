"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { reportUnexpectedError } from "@/app/_actions";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  const reportedRef = useRef(false);

  useEffect(() => {
    // 중복 전송 방지
    if (reportedRef.current) return;
    reportedRef.current = true;

    // 비동기로 전송하고 오류 자체는 삼킴
    reportUnexpectedError(error.message, error.stack).catch((err) => {
      console.error("[CRITICAL] Failed to report client error to server", err);
    });
  }, [error]);

  return (
    <main className="bg-gray-light flex min-h-screen flex-col items-center justify-center px-4 text-center dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-navy mt-6 text-2xl font-bold dark:text-white">오류가 발생했습니다</h1>
        <p className="text-gray-dark mt-2 text-sm dark:text-gray-300">
          예상치 못한 시스템 문제가 발생했습니다. 관리자에게 에러 로그가 자동으로 전송되었습니다.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="bg-navy hover:bg-navy/90 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="hover:bg-gray-light rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
