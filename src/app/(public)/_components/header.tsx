"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ThemeToggle from "./theme-toggle";
import { BUSINESS, LINKS } from "@/shared/constants";

const navItems = [
  { href: "/#services", label: "시공 안내" },
  { href: "/#gallery", label: "시공사례" },
  { href: "/#about", label: "소개" },
  { href: "/#contact", label: "연락처" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session as unknown as { role?: string })?.role === "admin";

  return (
    <header className="bg-navy sticky top-0 z-50 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          {BUSINESS.name}
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
          <Link href="/projects" className="hover:text-accent-light transition-colors">
            갤러리
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-accent hover:bg-accent-dark rounded px-3 py-1 text-sm font-semibold transition-colors"
            >
              관리자
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={LINKS.tel}
            className="bg-accent hover:bg-accent-dark hidden rounded px-3 py-1.5 text-sm font-semibold text-white transition-colors sm:inline-block"
          >
            📞 {BUSINESS.phone}
          </a>
          <ThemeToggle />
          <button
            className="min-h-11 min-w-11 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-2 px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/projects" onClick={() => setOpen(false)} className="block py-3">
            갤러리
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-accent-light block py-3 font-semibold"
            >
              관리자
            </Link>
          )}
          <a href={LINKS.tel} className="text-accent-light block py-3 font-semibold">
            📞 전화 상담
          </a>
        </nav>
      )}
    </header>
  );
}
