"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredTheme, setTheme, type Theme } from "@/client/theme";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "회사소개" },
  { href: "/projects", label: "포트폴리오" },
  { href: "/products", label: "제품안내" },
  { href: "/inquiry", label: "견적문의" },
  { href: "/contact", label: "연락처" },
];

function ThemeToggle() {
  const [theme, setLocal] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocal(getStoredTheme());
    setMounted(true);
  }, []);

  const cycle = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    setLocal(next);
  };

  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻";

  return (
    <button onClick={cycle} aria-label={`테마: ${theme}`} className="text-lg" suppressHydrationWarning>
      {mounted ? icon : null}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          서비스
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-gray-300">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="min-h-11 min-w-11 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-2 px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-3">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} 서비스</p>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
