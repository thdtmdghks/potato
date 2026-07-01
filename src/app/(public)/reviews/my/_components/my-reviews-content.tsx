import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";
import { getMyReviewsState } from "../_utils";
import { MyReviewsView } from "./my-reviews-view";

export async function MyReviewsContent() {
  const session = await auth();
  if (!session?.kakaoId) {
    return <MyReviewsView state={{ type: "AUTH_REQUIRED", redirectTo: ROUTES.myReviews }} />;
  }

  const { reviews, reviewEdits } = await getServerRepositories();
  const state = await getMyReviewsState(session, { reviews, reviewEdits });

  return <MyReviewsView state={state} />;
}
