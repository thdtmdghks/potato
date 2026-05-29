import Link from "next/link";
import { Button } from "@/app/_components/button";
import { ROUTES } from "@/shared/routes";

export function EmptyReviews() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-gray-50 p-4 dark:bg-gray-800/40">
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">작성된 후기가 없습니다</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        대표님께 전달받으신 시공 후기 링크 주소로 접속하시면
        <br />
        카카오 본인 확인 후 첫 후기를 등록하실 수 있습니다.
      </p>
      <div className="mt-6">
        <Link href={ROUTES.home}>
          <Button variant="outline">홈페이지 둘러보기</Button>
        </Link>
      </div>
    </div>
  );
}
