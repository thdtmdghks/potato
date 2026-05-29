import type { Review, ReviewEdit } from "@/shared/types";
import type { ReviewEditRepository } from "../repositories";
import type { MockReviewRepository } from "./review";

export class MockReviewEditRepository implements ReviewEditRepository {
  private editsData: ReviewEdit[] = [];

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
