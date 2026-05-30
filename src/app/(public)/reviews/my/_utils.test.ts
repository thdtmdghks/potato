import { describe, it, expect, vi } from "vitest";
import { getMyReviewsState } from "./_utils";
import type { MyReviewsDeps } from "./_types";
import type { Review } from "@/shared/types";

import { ROUTES } from "@/shared/routes";

describe("getMyReviewsState", () => {
  const createMockDeps = (overrides?: Partial<MyReviewsDeps>): MyReviewsDeps => ({
    reviews: {
      getByKakaoId: vi.fn().mockResolvedValue([]),
      ...overrides?.reviews,
    },
    reviewEdits: {
      getById: vi.fn().mockResolvedValue(null),
      ...overrides?.reviewEdits,
    },
  });

  it("로그인하지 않은 상태이면 AUTH_REQUIRED 상태를 반환한다", async () => {
    const deps = createMockDeps();
    const state = await getMyReviewsState(null, deps);
    expect(state).toEqual({
      type: "AUTH_REQUIRED",
      redirectTo: ROUTES.myReviews,
    });
  });

  it("로그인했으나 작성한 후기가 없으면 빈 리뷰 배열을 갖는 READY 상태를 반환한다", async () => {
    const deps = createMockDeps();
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getMyReviewsState(session, deps);
    expect(state).toEqual({
      type: "READY",
      userName: "홍길동",
      userImage: "avatar.jpg",
      reviews: [],
    });
  });

  it("작성한 후기가 존재하고 그 중 하나에 대기 중인 수정 건이 있으면 hasPendingEdit 여부를 올바르게 매핑하여 READY 상태를 반환한다", async () => {
    const mockReviews: Review[] = [
      {
        id: "review-1",
        kakao_id: "my-user",
        author_name: "홍길동",
        author_avatar: "avatar.jpg",
        content: "첫 번째 후기",
        images: ["img1.jpg"],
        status: "approved",
        created_at: "2026-05-29T00:00:00Z",
        updated_at: "2026-05-29T00:00:00Z",
      },
      {
        id: "review-2",
        kakao_id: "my-user",
        author_name: "홍길동",
        author_avatar: "avatar.jpg",
        content: "두 번째 후기",
        images: [],
        status: "pending",
        created_at: "2026-05-29T01:00:00Z",
        updated_at: "2026-05-29T01:00:00Z",
      },
    ];

    const deps = createMockDeps({
      reviews: {
        getByKakaoId: vi.fn().mockResolvedValue(mockReviews),
      },
      reviewEdits: {
        // review-1에 대해서만 수정 대기 데이터 반환
        getById: vi.fn().mockImplementation(async (id: string) => {
          if (id === "review-1") {
            return {
              review_id: "review-1",
              content: "수정 제안된 내용",
              images: ["img1.jpg"],
            };
          }
          return null;
        }),
      },
    });

    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getMyReviewsState(session, deps);
    expect(state).toEqual({
      type: "READY",
      userName: "홍길동",
      userImage: "avatar.jpg",
      reviews: [
        {
          ...mockReviews[0],
          hasPendingEdit: true,
        },
        {
          ...mockReviews[1],
          hasPendingEdit: false,
        },
      ],
    });
  });

  it("작성한 후기 중 status가 deleted 또는 rejected인 항목은 목록에서 필터링하여 제외한다", async () => {
    const mockReviews: Review[] = [
      {
        id: "review-1",
        kakao_id: "my-user",
        author_name: "홍길동",
        author_avatar: "avatar.jpg",
        content: "정상 후기",
        images: [],
        status: "approved",
        created_at: "2026-05-29T00:00:00Z",
        updated_at: "2026-05-29T00:00:00Z",
      },
      {
        id: "review-2",
        kakao_id: "my-user",
        author_name: "홍길동",
        author_avatar: "avatar.jpg",
        content: "삭제된 후기",
        images: [],
        status: "deleted",
        created_at: "2026-05-29T01:00:00Z",
        updated_at: "2026-05-29T01:00:00Z",
      },
      {
        id: "review-3",
        kakao_id: "my-user",
        author_name: "홍길동",
        author_avatar: "avatar.jpg",
        content: "반려된 후기",
        images: [],
        status: "rejected",
        created_at: "2026-05-29T02:00:00Z",
        updated_at: "2026-05-29T02:00:00Z",
      },
    ];

    const deps = createMockDeps({
      reviews: {
        getByKakaoId: vi.fn().mockResolvedValue(mockReviews),
      },
    });

    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };
    const state = await getMyReviewsState(session, deps);

    expect(state.type).toBe("READY");
    if (state.type === "READY") {
      expect(state.reviews.length).toBe(1);
      expect(state.reviews[0].id).toBe("review-1");
    }
  });
});
