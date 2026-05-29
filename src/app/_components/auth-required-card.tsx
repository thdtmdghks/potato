import { signIn } from "@/auth";
import Link from "next/link";
import { Button } from "@/app/_components/button";
import { ROUTES } from "@/shared/routes";

interface AuthRequiredCardProps {
  redirectTo: string;
  title?: string;
  description?: string;
}

export function AuthRequiredCard({
  redirectTo,
  title = "본인 인증이 필요합니다",
  description = "경산창호 후기 시스템은 실제 시공을 진행한\n고객님의 신뢰성 있는 작성만을 보증하기 위해\n카카오 로그인을 통한 실명 인증 후 서비스를 제공합니다.",
}: AuthRequiredCardProps) {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-yellow-50 p-3 dark:bg-yellow-950/20">
            <svg
              className="h-8 w-8 text-yellow-600 dark:text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-navy text-xl font-bold dark:text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-400">
          {description}
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("kakao", { redirectTo });
          }}
          className="mt-6"
        >
          <Button
            type="submit"
            className="h-11 w-full border-none bg-[#FEE500] font-semibold text-[#191919] hover:bg-[#FEE500]/90"
          >
            💬 카카오 로그인하고 시작하기
          </Button>
        </form>

        <Link
          href={ROUTES.home}
          className="mt-4 block text-xs text-gray-400 hover:underline dark:text-gray-500"
        >
          취소하고 경산창호 홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
