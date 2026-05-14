"use client";

import Link from "next/link";
import { useState } from "react";

const adminNav = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/projects", label: "시공사례 관리" },
  { href: "/admin/products", label: "서비스 관리" },
  { href: "/admin/inquiries", label: "문의 관리" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <div className="flex items-center justify-between bg-navy-dark p-4 text-white md:hidden">
        <span className="font-bold">관리자</span>
        <button onClick={() => setOpen(!open)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"}>
          {open ? "✕" : "☰"}
        </button>
      </div>

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

      <main className="flex-1 bg-white p-4 dark:bg-gray-900 md:p-8">{children}</main>
    </div>
  );
}
