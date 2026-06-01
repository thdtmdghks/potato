import { describe, it, expect } from "vitest";
import { projectSchema, reviewSchema } from "@/shared/schemas";

const valid = {
  title: "프로젝트 제목",
  description: "프로젝트 설명",
  category: "하이샤시",
};

describe("projectSchema", () => {
  it("유효한 데이터를 통과시킨다", () => {
    expect(projectSchema.safeParse(valid).success).toBe(true);
  });

  it("title이 비어있으면 실패한다", () => {
    expect(projectSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("description이 비어있으면 실패한다", () => {
    expect(projectSchema.safeParse({ ...valid, description: "" }).success).toBe(false);
  });

  it("category가 비어있으면 실패한다", () => {
    expect(projectSchema.safeParse({ ...valid, category: "" }).success).toBe(false);
  });
});

describe("reviewSchema", () => {
  const validReview = { content: "정말 좋은 시공이었습니다.", rating: 5 };

  it("유효한 데이터를 통과시킨다", () => {
    expect(reviewSchema.safeParse(validReview).success).toBe(true);
  });

  it("content가 5자 미만이면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, content: "짧음" }).success).toBe(false);
  });

  it("content가 1000자를 초과하면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, content: "a".repeat(1001) }).success).toBe(
      false,
    );
  });

  it("rating이 1 미만이면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false);
  });

  it("rating이 5 초과이면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false);
  });

  it("rating이 정수가 아니면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: 3.5 }).success).toBe(false);
  });

  it("rating이 NaN이면 실패한다", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: NaN }).success).toBe(false);
  });
});
