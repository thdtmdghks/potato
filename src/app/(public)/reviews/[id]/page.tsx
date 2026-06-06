import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { ROUTES } from "@/shared/routes";
import { formatDate } from "@/shared/utils";
import { Avatar } from "@/app/_components/avatar";
import { ReviewDetailImages } from "./_components/review-detail-images";
import { SITE_URL } from "@/shared/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { reviews } = await getServerRepositories();
  const review = await reviews.getById(id);

  if (!review || review.status !== "approved") {
    return { title: "후기를 찾을 수 없습니다 | 경산창호" };
  }

  const description = review.content.slice(0, 150) + (review.content.length > 150 ? "..." : "");
  const ogImage = review.primary_image ?? review.images[0];

  return {
    title: `${review.author_name}님의 시공 후기 | 경산창호`,
    description,
    alternates: {
      canonical: `${SITE_URL}/reviews/${id}`,
    },
    openGraph: {
      title: `${review.author_name}님의 시공 후기 | 경산창호`,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 800, height: 600 }] }),
    },
  };
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;
  const { reviews } = await getServerRepositories();
  const review = await reviews.getById(id);

  if (!review || review.status !== "approved") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href={ROUTES.home}
        className="text-navy mb-6 inline-block text-sm hover:underline dark:text-blue-400"
      >
        ← 홈으로 돌아가기
      </Link>

      <article className="space-y-6">
        {/* 작성자 정보 */}
        <header className="flex items-center gap-3">
          <Avatar src={review.author_avatar} size={48} />
          <div>
            <p className="text-navy text-lg font-bold dark:text-white">{review.author_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(review.created_at)}
            </p>
          </div>
        </header>

        {/* 별점 */}
        <div className="flex items-center gap-1" aria-label={`평점 ${review.rating}점`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${
                star <= review.rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"
              }`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
            {review.rating}점
          </span>
        </div>

        {/* 본문 */}
        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200">
          {review.content}
        </p>

        {/* 이미지 */}
        {review.images.length > 0 && <ReviewDetailImages images={review.images} />}
      </article>
    </main>
  );
}
