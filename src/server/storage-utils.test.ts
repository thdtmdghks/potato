import { describe, it, expect, vi } from "vitest";
import { extractStoragePath } from "./storage-utils";

vi.mock("./logger", () => ({
  logError: vi.fn(),
}));

describe("extractStoragePath", () => {
  it("정상 Supabase Storage URL에서 버킷 이후 경로를 추출한다", () => {
    expect(
      extractStoragePath(
        "https://xxx.supabase.co/storage/v1/object/public/images/projects/abc.webp",
      ),
    ).toBe("projects/abc.webp");
  });

  it("중첩 경로가 있는 URL에서 전체 하위 경로를 추출한다", () => {
    expect(
      extractStoragePath("https://xxx.supabase.co/storage/v1/object/public/images/a/b/c.webp"),
    ).toBe("a/b/c.webp");
  });

  it("Supabase Storage 형식이 아닌 URL이면 null을 반환한다", () => {
    expect(extractStoragePath("https://example.com/image.png")).toBeNull();
  });

  it("빈 문자열이면 null을 반환한다", () => {
    expect(extractStoragePath("")).toBeNull();
  });

  it("버킷명만 있고 파일 경로가 없는 URL이면 null을 반환한다", () => {
    expect(
      extractStoragePath("https://xxx.supabase.co/storage/v1/object/public/images/"),
    ).toBeNull();
  });
});
