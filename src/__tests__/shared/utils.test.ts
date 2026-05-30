import { describe, it, expect } from "vitest";
import {
  formatDate,
  generateUUIDv7,
  getTimestampFromUUIDv7,
  isUUIDv7Expired,
} from "@/shared/utils";

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

describe("UUID v7 Utils", () => {
  it("generateUUIDv7가 유효한 UUID v7 포맷을 반환한다", () => {
    const uuid = generateUUIDv7();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("getTimestampFromUUIDv7가 생성 시점의 타임스탬프를 올바르게 복원한다", () => {
    const now = Date.now();
    const uuid = generateUUIDv7();
    const ts = getTimestampFromUUIDv7(uuid);
    expect(ts).not.toBeNull();
    // 생성 시점 차이가 50ms 이내여야 함
    expect(Math.abs((ts ?? 0) - now)).toBeLessThan(50);
  });

  it("isUUIDv7Expired가 만료 시간에 맞춰 동작한다", () => {
    const uuid = generateUUIDv7();

    // 만료 시간 1초 후
    expect(isUUIDv7Expired(uuid, 5000)).toBe(false); // 5초는 아직 안 지남

    // 올바르지 않은 UUID 포맷
    expect(isUUIDv7Expired("invalid-uuid", 5000)).toBe(true);
  });
});
