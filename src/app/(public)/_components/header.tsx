"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { href: "/#services", label: "서비스" },
  { href: "/#gallery", label: "시공사례" },
  { href: "/#about", label: "소개" },
  { href: "/#contact", label: "연락처" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session as unknown as { role?: string })?.role === "admin";

  return (
    <header className="bg-navy text-white sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          경산창호
        </Link>
        <nav className="hidden gap-6 md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-accent-light"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/projects" className="transition-colors hover:text-accent-light">
            갤러리
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded bg-accent px-3 py-1 text-sm font-semibold transition-colors hover:bg-accent-dark"
            >
              관리자
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="tel:010-3812-9922"
            className="hidden sm:inline-block rounded bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            📞 010-3812-9922
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
              className="block py-3 text-accent-light font-semibold"
            >
              관리자
            </Link>
          )}
          <a href="tel:010-3812-9922" className="block py-3 text-accent-light font-semibold">
            📞 전화 상담
          </a>
        </nav>
      )}
    </header>
  );
}
