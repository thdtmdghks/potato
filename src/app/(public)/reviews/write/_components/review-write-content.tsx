import { auth } from "@/auth";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";
import { getReviewWriteState } from "../_utils";
import { ReviewWriteView } from "./review-write-view";

interface Props {
  id: string;
}

export async function ReviewWriteContent({ id }: Props) {
  const session = await auth();
  if (!session?.kakaoId) {
    return (
      <ReviewWriteView state={{ type: "AUTH_REQUIRED", redirectTo: ROUTES.writeReview(id) }} />
    );
  }

  const { reviews, reviewEdits } = await getServerRepositories();
  const state = await getReviewWriteState(id, session, { reviews, reviewEdits });

  return <ReviewWriteView state={state} />;
}
