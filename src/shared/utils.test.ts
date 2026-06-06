import { describe, it, expect } from "vitest";
import {
  formatDate,
  generateUUIDv7,
  getTimestampFromUUIDv7,
  isUUIDv7Expired,
  formatSize,
  maskName,
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

describe("formatSize", () => {
  it("1024 B 미만일 때 B 단위로 올바르게 변형한다", () => {
    expect(formatSize(500)).toBe("500 B");
    expect(formatSize(0)).toBe("0 B");
  });

  it("1 MB 미만일 때 KB 단위로 올바르게 변형한다", () => {
    expect(formatSize(1024)).toBe("1.0 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(102400)).toBe("100.0 KB");
  });

  it("1 MB 이상일 때 MB 단위로 올바르게 변형한다", () => {
    expect(formatSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });
});

describe("maskName", () => {
  it("3글자 이름은 가운데를 마스킹한다", () => {
    expect(maskName("홍길동")).toBe("홍*동");
    expect(maskName("이순신")).toBe("이*신");
  });

  it("2글자 이름은 뒷글자를 마스킹한다", () => {
    expect(maskName("김이")).toBe("김*");
  });

  it("1글자 이름은 마스킹하지 않는다", () => {
    expect(maskName("김")).toBe("김");
  });

  it("4글자 이상 이름은 첫/끝만 남기고 마스킹한다", () => {
    expect(maskName("남궁민수")).toBe("남**수");
    expect(maskName("독고진우현")).toBe("독***현");
  });
});
