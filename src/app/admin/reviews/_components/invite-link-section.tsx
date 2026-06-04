"use client";

import { useState } from "react";
import { generateUUIDv7 } from "@/shared/utils";

export function InviteLinkSection() {
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    const uuid = generateUUIDv7();

    const link = `${window.location.origin}/reviews/write?id=${uuid}`;
    setGeneratedLink(link);
    setCopied(false);

    const shareData = {
      title: "경산창호 시공 후기 요청",
      text: "경산창호 시공은 만족스러우셨나요? 소중한 후기를 남겨주시면 큰 힘이 됩니다!",
      url: link,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn("공유 취소 또는 에러:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("클립보드 복사 실패:", err);
      }
    }
  };

  const handleManualCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-navy text-lg font-bold dark:text-white">리뷰 초대 링크 발송</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        고객 전용 고유 리뷰 링크를 발급합니다. 모바일에서는 클릭 시 바로 카카오톡이나 문자 공유 창이
        열립니다.
      </p>

      <div className="mt-6">
        <button
          onClick={handleGenerateLink}
          className="bg-accent hover:bg-accent-dark flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition-all active:scale-98"
        >
          💬 후기 요청 링크 생성 및 공유
        </button>
      </div>

      {generatedLink && (
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              발급된 고유 링크
            </p>
            <p className="mt-1 font-mono text-xs break-all text-gray-600 dark:text-gray-300">
              {generatedLink}
            </p>
          </div>
          <button
            onClick={handleManualCopy}
            className="bg-navy hover:bg-navy-light flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-white transition-colors"
          >
            {copied ? "✅ 링크 복사 완료!" : "📋 링크 수동 복사"}
          </button>
        </div>
      )}
    </section>
  );
}
