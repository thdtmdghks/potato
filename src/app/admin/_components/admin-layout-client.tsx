"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/app/_components/button";
import { ROUTES } from "@/shared/routes";

const adminNav = [
  { href: ROUTES.admin.root, label: "대시보드", exact: true },
  { href: ROUTES.admin.projects, label: "시공사례" },
  { href: ROUTES.admin.reviews, label: "리뷰관리" },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Link href={ROUTES.home} className="text-navy text-lg font-bold dark:text-white">
                경산창호
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href={ROUTES.admin.root} className="text-accent text-sm font-semibold">
                관리자
              </Link>
            </div>
            <nav className="hidden items-center gap-1 sm:flex">
              {adminNav.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-navy/10 text-navy dark:bg-blue-950/40 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: ROUTES.home })}
            variant="ghost"
            className="text-xs text-gray-500"
          >
            로그아웃
          </Button>
        </div>
        {/* 모바일 네비 */}
        <nav className="flex border-t border-gray-100 sm:hidden dark:border-gray-800">
          {adminNav.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-2.5 text-center text-xs font-medium ${
                  isActive
                    ? "border-navy text-navy border-b-2 dark:border-blue-400 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
