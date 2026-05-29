import { describe, it, expect } from "vitest";
import { isValidUUID } from "./_utils";

describe("isValidUUID", () => {
  it("올바른 형식의 UUID v4를 넣으면 true를 반환한다", () => {
    const validUUID = "a5e8b4e7-4952-4752-87ad-d094e8e12fa6";
    expect(isValidUUID(validUUID)).toBe(true);
  });

  it("대문자가 섞인 올바른 형식의 UUID v4를 넣어도 true를 반환한다", () => {
    const validUUID = "A5E8B4E7-4952-4752-87AD-D094E8E12FA6";
    expect(isValidUUID(validUUID)).toBe(true);
  });

  it("빈 문자열을 넣으면 false를 반환한다", () => {
    expect(isValidUUID("")).toBe(false);
  });

  it("길이가 잘못되었거나 형식이 다른 문자열은 false를 반환한다", () => {
    expect(isValidUUID("invalid-uuid-string")).toBe(false);
    expect(isValidUUID("12345678-1234-1234-1234-1234567890ab")).toBe(false);
  });
});
