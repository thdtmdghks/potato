"use client";

import Link from "next/link";
import { useState } from "react";

const adminNav = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/projects", label: "포트폴리오 관리" },
  { href: "/admin/products", label: "제품 관리" },
  { href: "/admin/inquiries", label: "문의 관리" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      {/* 모바일: 상단 바 */}
      <div className="flex items-center justify-between bg-navy-dark p-4 text-white md:hidden">
        <h2 className="font-bold">관리자</h2>
        <button onClick={() => setOpen(!open)} aria-label="메뉴">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* 사이드바: 모바일은 토글, 데스크톱은 항상 표시 */}
      <aside
        className={`bg-navy-dark p-4 text-white ${open ? "block" : "hidden"} space-y-2 md:block md:w-56`}
      >
        <h2 className="mb-6 hidden text-lg font-bold md:block">관리자</h2>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 transition-colors hover:bg-navy-light"
          >
            {item.label}
          </Link>
        ))}
      </aside>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
