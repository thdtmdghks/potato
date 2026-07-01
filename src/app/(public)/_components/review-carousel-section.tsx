import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import { getHomeReviews } from "../_utils";
import { ReviewCarousel } from "./review-carousel";

export async function ReviewCarouselSection() {
  const approvedReviews = await getHomeReviews();

  if (approvedReviews.length === 0) return null;

  return (
    <section className="border-t border-gray-100 bg-gray-50/30 py-20 dark:border-gray-800 dark:bg-gray-950/10">
      <div className="mx-auto mb-12 max-w-5xl px-4 text-center">
        <h2 className="text-navy text-2xl font-bold dark:text-white">고객 시공 후기</h2>
        <p className="text-gray-dark mt-2 text-sm dark:text-gray-400">
          실제 경산창호를 이용하신 고객님들의 생생한 한마디입니다
        </p>
      </div>
      <ReviewCarousel reviews={approvedReviews} />
      <div className="mt-8 text-center">
        <Link href={ROUTES.reviews} className="text-accent text-sm font-semibold hover:underline">
          전체 후기 보기 →
        </Link>
      </div>
    </section>
  );
}
