import { getServerRepositories } from "@/server";
import { AdminReviewsView } from "./admin-reviews-view";

export async function AdminReviewsContent() {
  const { reviews, reviewEdits } = await getServerRepositories();

  const pendingReviews = await reviews.getAllPending();
  const editRequests = await reviewEdits.getAllWithOriginal();

  return <AdminReviewsView pendingReviews={pendingReviews} editRequests={editRequests} />;
}
