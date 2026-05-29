import type { Metadata } from "next";
import { getServerRepositories } from "@/server";
import { AdminReviewsView } from "./_components/admin-reviews-view";

export const metadata: Metadata = {
  title: "리뷰 관리 | 경산창호 관리자",
};

export default async function AdminReviewsPage() {
  const { reviews, reviewEdits } = await getServerRepositories();

  const pendingReviews = await reviews.getAllPending();
  const editRequests = await reviewEdits.getAllWithOriginal();

  return <AdminReviewsView pendingReviews={pendingReviews} editRequests={editRequests} />;
}
