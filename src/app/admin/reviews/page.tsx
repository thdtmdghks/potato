"use client";

import { useState } from "react";

export default function AdminReviewsPage() {
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    // 무작위 UUID 생성
    const uuid = crypto.randomUUID();
    const link = `${window.location.origin}/reviews/write?id=${uuid}`;
    setGeneratedLink(link);
    setCopied(false);

    // 모바일 등 Web Share API 지원 시 바로 공유 시도
    const shareData = {
      title: "경산창호 시공 후기 요청",
      text: "경산창호 시공은 만족스러우셨나요? 소중한 후기를 남겨주시면 큰 힘이 됩니다!",
      url: link,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn("공유 취소 또는 에러:", err);
      }
    } else {
      // 데스크톱 환경에서는 클립보드에 자동 복사
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
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-bold dark:text-white">리뷰(후기) 관리</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          고객에게 전달할 리뷰 요청 일회용 초대 링크를 생성하고 공유합니다.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-navy text-lg font-bold dark:text-white">리뷰 초대 링크 발송</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          아래 버튼을 누르면 고객이 작성할 수 있는 고유 링크가 발급됩니다. 모바일에서는 바로
          카카오톡 선택창이 열립니다.
        </p>

        <div className="mt-6">
          <button
            onClick={handleGenerateLink}
            className="bg-accent hover:bg-accent-dark flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition-colors"
          >
            💬 후기 요청 링크 생성 및 카톡 공유
          </button>
        </div>

        {generatedLink && (
          <div className="mt-6 space-y-3">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-semibold text-gray-400">생성된 링크</p>
              <p className="mt-1 font-mono text-sm break-all text-gray-700 dark:text-gray-300">
                {generatedLink}
              </p>
            </div>
            <button
              onClick={handleManualCopy}
              className="bg-navy hover:bg-navy-light flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white transition-colors"
            >
              {copied ? "✅ 링크 복사 완료!" : "📋 링크 수동 복사"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
