"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { BUSINESS, LINKS } from "@/shared/constants";
import { useMenuWithHistory } from "@/client/use-menu-with-history";
import { ROUTES } from "@/shared/routes";

const navItems = [
  { href: `${ROUTES.home}#gallery`, label: "시공사례" },
  { href: `${ROUTES.home}#contact`, label: "연락처" },
];

export function Header() {
  const { open, toggle, closeMenu } = useMenuWithHistory();
  const { data: session } = useSession();
  const isAdmin = session?.role === "admin";

  return (
    <header className="bg-navy sticky top-0 z-50 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={ROUTES.home} className="text-xl font-bold">
          {BUSINESS.name}
          <span className="sr-only"> - {BUSINESS.region} 샤시 샷시 하이샤시 샷시시공 전문</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent-light transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href={ROUTES.projects} className="hover:text-accent-light transition-colors">
            갤러리
          </Link>
          {isAdmin && (
            <Link
              href={ROUTES.admin.root}
              prefetch={false}
              className="bg-accent hover:bg-accent-dark rounded px-3 py-1 text-sm font-semibold transition-colors"
            >
              관리자
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <Link
              href={ROUTES.myReviews}
              className="hidden text-sm font-medium text-white/80 hover:text-white md:inline-block"
            >
              내 후기
            </Link>
          ) : (
            <Link
              href={ROUTES.login}
              className="hidden text-sm font-medium text-white/80 hover:text-white md:inline-block"
            >
              로그인
            </Link>
          )}
          <ThemeToggle />
          <button
            className="-my-2 flex h-14 w-14 items-center justify-center text-3xl md:hidden"
            onClick={toggle}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMenu} />}
      <nav
        className={`bg-navy fixed inset-y-0 right-0 z-50 w-64 transform px-4 py-6 transition-transform md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu} className="block py-3">
              {item.label}
            </Link>
          ))}
          <Link href={ROUTES.projects} onClick={closeMenu} className="block py-3">
            갤러리
          </Link>
          <div className="my-2 border-t border-white/20" />
          {session ? (
            <Link href={ROUTES.myReviews} onClick={closeMenu} className="block py-3">
              내 후기
            </Link>
          ) : (
            <Link href={ROUTES.login} onClick={closeMenu} className="block py-3">
              로그인
            </Link>
          )}
          {isAdmin && (
            <Link
              href={ROUTES.admin.root}
              prefetch={false}
              onClick={closeMenu}
              className="text-accent-light block py-3 font-semibold"
            >
              관리자
            </Link>
          )}
          <a href={LINKS.tel} className="text-accent-light block py-3 font-semibold">
            📞 전화 상담
          </a>
        </div>
      </nav>
    </header>
  );
}
