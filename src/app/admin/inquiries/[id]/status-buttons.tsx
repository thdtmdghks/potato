"use client";

import { statusLabel } from "../../constants";

export function StatusButtons({
  currentStatus,
  inquiryId: _inquiryId,
}: {
  currentStatus: string;
  inquiryId: string;
}) {
  return (
    <div className="flex gap-2">
      {(["pending", "confirmed", "completed"] as const).map((s) => (
        <button
          key={s}
          disabled={currentStatus === s}
          onClick={() => {}} // TODO: Server Action 연동
          className={`rounded px-3 py-2 text-sm ${currentStatus === s ? "bg-navy text-white" : "bg-gray-light text-gray-dark hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}
        >
          {statusLabel[s]}
        </button>
      ))}
    </div>
  );
}
