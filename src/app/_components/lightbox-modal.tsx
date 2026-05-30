"use client";

import Image from "next/image";
import { useEffect } from "react";

interface LightboxModalProps {
  url: string;
  onClose: () => void;
}

export function LightboxModal({ url, onClose }: LightboxModalProps) {
  // ESC 키로 모달 닫기 지원 및 스크롤 고정
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition-colors hover:bg-white/20"
        aria-label="닫기"
      >
        ×
      </button>
      <div className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-lg shadow-2xl">
        <Image
          src={url}
          alt="시공 사진 크게 보기"
          width={1200}
          height={900}
          className="max-h-[85vh] w-auto max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
