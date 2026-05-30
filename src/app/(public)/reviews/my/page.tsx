import type { Metadata } from "next";
import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { getMyReviewsState } from "./_utils";
import { MyReviewsView } from "./_components/my-reviews-view";
import { ROUTES } from "@/shared/routes";

export const metadata: Metadata = {
  title: "내가 작성한 후기 | 경산창호",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyReviewsPage() {
  const session = await auth();
  if (!session?.kakaoId) {
    return <MyReviewsView state={{ type: "AUTH_REQUIRED", redirectTo: ROUTES.myReviews }} />;
  }

  const { reviews, reviewEdits } = await getServerRepositories();

  const state = await getMyReviewsState(session, { reviews, reviewEdits });

  return <MyReviewsView state={state} />;
}
