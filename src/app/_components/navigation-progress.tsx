"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathnameRef = useRef(pathname);

  // pathname 변경 → 네비게이션 완료
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      setNavigating(false);
      setProgress(0);
    }
  }, [pathname]);

  // 프로그레스 애니메이션
  useEffect(() => {
    if (!navigating) return;

    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 200);

    return () => clearInterval(timer);
  }, [navigating]);

  // Link 클릭 감지
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.includes("#") || href.startsWith("tel:")) {
        return;
      }

      if (href !== prevPathnameRef.current) {
        setNavigating(true);
        setProgress(20);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!navigating) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-[100] h-0.5">
      <div
        className="bg-accent h-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
