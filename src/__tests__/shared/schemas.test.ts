import { describe, it, expect } from "vitest";
import { projectSchema } from "@/shared/schemas";

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
