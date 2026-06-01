"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useMenuWithHistory } from "@/client/use-menu-with-history";
import { ROUTES } from "@/shared/routes";

const adminNav = [
  { href: ROUTES.admin.root, label: "대시보드" },
  { href: ROUTES.admin.projects, label: "시공사례 관리" },
  { href: ROUTES.admin.reviews, label: "리뷰 관리" },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { open, toggle, closeMenu } = useMenuWithHistory();
  const { data: session } = useSession();
  const kakaoId = session?.kakaoId;

  return (
    <div className="min-h-screen md:flex">
      <div className="bg-navy-dark sticky top-0 z-50 flex items-center justify-between p-4 text-white md:hidden">
        <span className="font-bold">관리자</span>
        <button
          className="-my-2 flex h-14 w-14 items-center justify-center text-3xl"
          onClick={toggle}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMenu} />}

      <aside
        className={`bg-navy-dark fixed inset-y-0 left-0 z-50 w-56 transform p-4 text-white transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} space-y-2 md:block`}
      >
        <h2 className="mb-6 hidden text-lg font-bold md:block">관리자</h2>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className="hover:bg-navy-light block rounded px-3 py-2 transition-colors"
          >
            {item.label}
          </Link>
        ))}

        <div className="mt-6 border-t border-white/20 pt-4">
          <Link
            href={ROUTES.home}
            className="mb-3 block rounded px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            홈페이지 보기
          </Link>
          {kakaoId && <p className="mb-2 text-xs text-white/60">ID: {kakaoId}</p>}
          <button
            onClick={() => signOut({ callbackUrl: ROUTES.home })}
            className="w-full rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-white p-4 md:p-8 dark:bg-gray-900">{children}</main>
    </div>
  );
}
