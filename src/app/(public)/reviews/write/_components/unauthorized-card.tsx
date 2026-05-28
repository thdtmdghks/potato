import Link from "next/link";
import { Button } from "@/app/_components/button";

export function UnauthorizedCard() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
        <h1 className="text-xl font-bold text-red-600 dark:text-red-400">접근 권한 없음</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          이 후기는 다른 카카오 계정으로 작성되었습니다.
          <br />
          본인의 후기만 수정할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-col space-y-2">
          <Link href="/reviews/my">
            <Button className="bg-navy hover:bg-navy/90 w-full text-white dark:bg-blue-600 dark:hover:bg-blue-700">
              내가 작성한 후기 보기
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              홈페이지로 이동
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
