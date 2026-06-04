import type { Review, ReviewEdit } from "@/shared/types";
import type { ReviewEditRepository } from "../repositories";
import type { MockReviewRepository } from "./review";

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export class MockReviewEditRepository implements ReviewEditRepository {
  private editsData: ReviewEdit[] = [
    // 1) #8 세종대왕 — content + images 둘 다 변경
    {
      review_id: "018fc723-b780-7000-8000-000000000008",
      content:
        "잡철 시공 깔끔합니다. 난간 용접 부위 마감이 특히 좋았어요. 추가로 6개월 지나서 확인해보니 녹도 안 슬고 튼튼합니다!",
      images: [IMG("rev8a"), IMG("rev8b"), IMG("rev8c")],
      primary_image: IMG("rev8c"),
      rating: 5,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    // 2) #3 임꺽정 — content만 변경 (images 동일)
    {
      review_id: "018fc723-b780-7000-8000-000000000003",
      content: "보통이에요. 마감이 아쉬웠는데 사후 서비스로 보완해주셔서 수정합니다. 감사합니다.",
      images: [IMG("rev3a"), IMG("rev3b"), IMG("rev3c")],
      primary_image: IMG("rev3b"),
      rating: 3,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    // 3) #2 이순신 — rating 변경 + images 추가
    {
      review_id: "018fc723-b780-7000-8000-000000000002",
      content:
        "방충망 교체를 맡겼는데 미세먼지 차단망으로 업그레이드해 주셨어요. 시공도 빠르고 마감도 깔끔합니다. 가격도 합리적이라 만족합니다.",
      images: [IMG("mesh1"), IMG("mesh2")],
      primary_image: IMG("mesh2"),
      rating: 5,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ];

  constructor(private reviewsRepo: MockReviewRepository) {}

  async getById(reviewId: string): Promise<ReviewEdit | null> {
    return this.editsData.find((e) => e.review_id === reviewId) ?? null;
  }

  async getAll(): Promise<ReviewEdit[]> {
    return [...this.editsData].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async getAllWithOriginal(): Promise<(ReviewEdit & { original: Review })[]> {
    const result: (ReviewEdit & { original: Review })[] = [];
    for (const edit of this.editsData) {
      const original = await this.reviewsRepo.getById(edit.review_id);
      if (original) {
        result.push({
          ...edit,
          original,
        });
      }
    }
    return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async upsert(data: Omit<ReviewEdit, "created_at">): Promise<ReviewEdit | null> {
    const idx = this.editsData.findIndex((e) => e.review_id === data.review_id);
    const item: ReviewEdit = {
      ...data,
      created_at: new Date().toISOString(),
    };
    if (idx === -1) {
      this.editsData.push(item);
    } else {
      this.editsData[idx] = item;
    }
    return item;
  }

  async delete(reviewId: string): Promise<boolean> {
    const len = this.editsData.length;
    this.editsData = this.editsData.filter((e) => e.review_id !== reviewId);
    return this.editsData.length < len;
  }
}
