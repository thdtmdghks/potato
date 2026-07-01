import Image from "next/image";
import Link from "next/link";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";
import { formatDate } from "@/shared/utils";
import { Avatar } from "@/app/_components/avatar";

export async function ReviewList() {
  const { reviews } = await getServerRepositories();
  const approvedReviews = await reviews.getAllApproved();

  if (approvedReviews.length === 0) {
    return <p className="py-20 text-center text-sm text-gray-500">등록된 후기가 없습니다.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {approvedReviews.map((review) => (
        <Link
          key={review.id}
          href={ROUTES.reviewDetail(review.id)}
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          {/* 대표 이미지 */}
          {(review.primary_image || review.images[0]) && (
            <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
              <Image
                src={review.primary_image ?? review.images[0]}
                alt={`${review.author_name}님 시공 사진`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {review.images.length > 1 && (
                <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                  +{review.images.length - 1}장
                </span>
              )}
            </div>
          )}

          <div className="space-y-3 p-5">
            {/* 별점 */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${star <= review.rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* 본문 */}
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {review.content}
            </p>

            {/* 작성자 */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Avatar src={review.author_avatar} size={24} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {review.author_name}
                </span>
              </div>
              <span className="text-[10px] text-gray-400">{formatDate(review.created_at)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
