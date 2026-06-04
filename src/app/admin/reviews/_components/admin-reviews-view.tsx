"use client";

import { useState } from "react";
import type { Review, ReviewEdit } from "@/shared/types";
import { InviteLinkSection } from "./invite-link-section";
import { PendingReviewsList } from "./pending-reviews-list";
import { EditRequestsList } from "./edit-requests-list";
import { approveReview, deleteReview, approveReviewEdit, rejectReviewEdit } from "../_actions";

interface Props {
  pendingReviews: Review[];
  editRequests: (ReviewEdit & { original: Review })[];
}

type ActionResponse = { success: true } | { success: false; error: string };

export function AdminReviewsView({ pendingReviews, editRequests }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 서버 액션 호출 래퍼
  const runAction = async (id: string, action: () => Promise<ActionResponse>) => {
    setLoadingId(id);
    setActionError(null);
    try {
      const res = await action();
      if (!res.success) {
        setActionError(res.error);
      }
    } catch {
      setActionError("서버 오류가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-navy text-3xl font-bold dark:text-white">리뷰(후기) 관리</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          신규 작성된 리뷰를 승인하거나 고객의 수정 요청 사항을 검토하여 반영합니다.
        </p>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          ⚠️ {actionError}
        </div>
      )}

      <InviteLinkSection />

      <PendingReviewsList
        reviews={pendingReviews}
        loadingId={loadingId}
        onApprove={(id, primaryImage) => runAction(id, () => approveReview(id, primaryImage))}
        onDelete={(id) => runAction(id, () => deleteReview(id))}
      />

      {/* 수정 요청 후기 비교 관리 */}
      <EditRequestsList
        editRequests={editRequests}
        loadingId={loadingId}
        onApprove={(id) => runAction(id, () => approveReviewEdit(id))}
        onReject={(id) => runAction(id, () => rejectReviewEdit(id))}
      />
    </div>
  );
}
