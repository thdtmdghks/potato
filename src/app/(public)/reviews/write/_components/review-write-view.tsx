import type { ReviewWriteState } from "../_types";
import { InvalidLinkCard } from "./invalid-link-card";
import { AuthRequiredCard } from "@/app/_components/auth-required-card";
import { UnauthorizedCard } from "./unauthorized-card";
import { ReviewForm } from "./review-form";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";

interface ReviewWriteViewProps {
  state: ReviewWriteState;
}

export function ReviewWriteView({ state }: ReviewWriteViewProps) {
  if (state.type === "INVALID_LINK") {
    return <InvalidLinkCard />;
  }

  if (state.type === "AUTH_REQUIRED") {
    return <AuthRequiredCard redirectTo={state.redirectTo} />;
  }

  if (state.type === "UNAUTHORIZED") {
    return <UnauthorizedCard />;
  }

  // READY 상태
  const { id, initialData, isApproved, userProfile } = state;
  const isEditing = initialData !== null;

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-12 dark:bg-black">
      <div className="mx-auto mb-6 flex max-w-xl items-center justify-between">
        <Link href={ROUTES.home} className="text-navy text-sm hover:underline dark:text-blue-400">
          ← 경산창호 홈
        </Link>
        {isEditing && (
          <Link
            href={ROUTES.myReviews}
            className="text-navy text-sm hover:underline dark:text-blue-400"
          >
            내 후기 목록 →
          </Link>
        )}
      </div>

      <div className="mx-auto mb-8 max-w-xl text-center">
        <h1 className="text-navy text-3xl font-extrabold tracking-tight dark:text-white">
          {isEditing ? "시공 후기 수정" : "시공 후기 작성"}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          고객님의 소중한 후기가 경산창호에 큰 힘이 됩니다.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <ReviewForm
          id={id}
          initialData={initialData}
          isApproved={isApproved}
          userProfile={userProfile}
        />
      </div>
    </main>
  );
}
