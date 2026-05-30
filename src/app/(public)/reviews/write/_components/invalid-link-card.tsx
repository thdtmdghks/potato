import Link from "next/link";
import { Button } from "@/app/_components/button";
import { ROUTES } from "@/shared/routes";

interface InvalidLinkCardProps {
  title?: string;
  description?: string;
}

export function InvalidLinkCard({
  title = "유효하지 않은 요청",
  description = "후기 작성 링크가 올바르지 않거나 만료되었습니다.",
}: InvalidLinkCardProps) {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
        <h1 className="text-xl font-bold text-red-600 dark:text-red-400">{title}</h1>
        <p className="mt-2 text-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
          {description}
          {"\n"}
          대표님께 새 리뷰 요청 링크를 발급받아 주세요.
        </p>
        <div className="mt-6">
          <Link href={ROUTES.home}>
            <Button className="bg-navy hover:bg-navy/90 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
              홈페이지로 이동
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
