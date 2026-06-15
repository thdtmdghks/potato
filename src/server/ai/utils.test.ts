import { describe, it, expect } from "vitest";
import { parseBase64Image, sanitizeResponseField, buildUserPrompt } from "./utils";

describe("parseBase64Image", () => {
  it("올바른 data URL에서 mimeType과 base64Data를 정상 추출한다", () => {
    const imgStr = "data:image/webp;base64,aGVsbG8gd29ybGQ=";
    const result = parseBase64Image(imgStr);
    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe("image/webp");
    expect(result?.base64Data).toBe("aGVsbG8gd29ybGQ=");
  });

  it("data:로 시작하지 않는 문자열이면 null을 반환한다", () => {
    expect(parseBase64Image("http://example.com/img.png")).toBeNull();
    expect(parseBase64Image("image/webp;base64,aGVsbG8=")).toBeNull();
  });

  it("콤마(,)가 포함되지 않은 올바르지 않은 data URL 포맷이면 null을 반환한다", () => {
    expect(parseBase64Image("data:image/webp;base64;aGVsbG8=")).toBeNull();
  });

  it("mimeType이 누락되거나 매칭이 안 되면 기본값 image/jpeg를 반환한다", () => {
    const result = parseBase64Image("data:;base64,aGVsbG8=");
    expect(result).not.toBeNull();
    expect(result?.mimeType).toBe("image/jpeg");
    expect(result?.base64Data).toBe("aGVsbG8=");
  });
});

describe("sanitizeResponseField", () => {
  it("문자열의 앞뒤 감싸진 큰따옴표를 정제한다", () => {
    expect(sanitizeResponseField('"hello"')).toBe("hello");
    expect(sanitizeResponseField('  "world"  ')).toBe("world");
  });

  it("따옴표가 없는 일반 문자열은 그대로 반환한다", () => {
    expect(sanitizeResponseField("hello")).toBe("hello");
  });

  it("비어있는 값이 들어오면 빈 문자열을 반환한다", () => {
    expect(sanitizeResponseField("")).toBe("");
  });
});

describe("buildUserPrompt", () => {
  it("매개변수에 따라 올바른 프롬프트를 구성한다", () => {
    const prompt = buildUserPrompt({
      region: "대구 수성구",
      buildingType: "상가",
      categories: ["유리", "방충망"],
      details: "유리 교체 공사",
    });
    expect(prompt).toContain("시공 지역: 대구 수성구");
    expect(prompt).toContain("건물 유형: 상가");
    expect(prompt).toContain("시공 품목: 유리, 방충망");
    expect(prompt).toContain("세부 작업 및 현장 상황: 유리 교체 공사");
  });
});
