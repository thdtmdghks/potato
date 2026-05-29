import type { Review } from "@/shared/types";

export type MyReviewsState =
  | { type: "AUTH_REQUIRED"; redirectTo: string }
  | {
      type: "READY";
      userName?: string | null;
      userImage?: string | null;
      reviews: (Review & { hasPendingEdit: boolean })[];
    };

export interface MyReviewsDeps {
  reviews: {
    getByKakaoId: (kakaoId: string) => Promise<Review[]>;
  };
  reviewEdits: {
    getById: (id: string) => Promise<{
      review_id: string;
      content: string;
      images: string[];
    } | null>;
  };
}
