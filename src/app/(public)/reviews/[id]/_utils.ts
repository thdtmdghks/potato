import type { Metadata } from "next";
import { cache } from "react";
import { getServerRepositories } from "@/server";
import { SITE_URL } from "@/shared/constants";
import type { Review } from "@/shared/types";

export const getReview = cache(async (id: string): Promise<Review | null> => {
  const { reviews } = await getServerRepositories();
  return reviews.getById(id);
});

export const getAllReviewParams = async () => {
  const { reviews } = await getServerRepositories();
  const items = await reviews.getAllApproved();
  return items.map((item) => ({ id: item.id }));
};

export const getReviewDetailMetadata = async (id: string): Promise<Metadata> => {
  const review = await getReview(id);

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
};
