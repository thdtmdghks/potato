import { describe, it, expect } from "vitest";
import { formatDate } from "@/shared/utils";

describe("formatDate", () => {
  it("날짜 문자열을 YYYY. MM. DD. 형식으로 올바르게 변환한다", () => {
    expect(formatDate("2026-05-29T16:32:43+09:00")).toBe("2026. 05. 29.");
    expect(formatDate("2026-01-02")).toBe("2026. 01. 02.");
  });

  it("Date 객체를 YYYY. MM. DD. 형식으로 올바르게 변환한다", () => {
    const date = new Date(2026, 4, 9); // Month is 0-indexed (4 = May)
    expect(formatDate(date)).toBe("2026. 05. 09.");
  });

  it("유효하지 않은 날짜인 경우 빈 문자열을 반환한다", () => {
    expect(formatDate("invalid-date-string")).toBe("");
  });

  it("날짜 입력이 빈 문자열인 경우 빈 문자열을 반환한다", () => {
    expect(formatDate("")).toBe("");
  });
});
