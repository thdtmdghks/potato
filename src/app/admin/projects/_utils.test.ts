import { describe, it, expect } from "vitest";
import { resolvePrimaryImage } from "./_utils";

describe("resolvePrimaryImage", () => {
  it("선택된 URL이 전체 이미지 목록에 있으면 그대로 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: "existing.webp",
        primaryImageIndex: null,
        existingImages: ["existing.webp"],
        newImageUrls: ["new.webp"],
      }),
    ).toBe("existing.webp");
  });

  it("선택된 URL이 목록에 없고 index가 유효하면 새 이미지에서 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: "deleted.webp",
        primaryImageIndex: 0,
        existingImages: [],
        newImageUrls: ["new.webp"],
      }),
    ).toBe("new.webp");
  });

  it("선택 URL도 없고 index도 없으면 전체 첫 번째를 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: null,
        primaryImageIndex: null,
        existingImages: ["a.webp"],
        newImageUrls: ["b.webp"],
      }),
    ).toBe("a.webp");
  });

  it("모든 이미지가 비어있으면 null을 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: null,
        primaryImageIndex: null,
        existingImages: [],
        newImageUrls: [],
      }),
    ).toBeNull();
  });

  it("index가 범위를 벗어나면 첫 번째를 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: null,
        primaryImageIndex: 99,
        existingImages: [],
        newImageUrls: ["a.webp"],
      }),
    ).toBe("a.webp");
  });

  it("index가 NaN이면 첫 번째를 반환한다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: null,
        primaryImageIndex: NaN,
        existingImages: ["a.webp"],
        newImageUrls: [],
      }),
    ).toBe("a.webp");
  });

  it("신규 생성 시 (existingImages 빈 배열) index로 선택 가능하다", () => {
    expect(
      resolvePrimaryImage({
        primaryImageUrl: null,
        primaryImageIndex: 1,
        existingImages: [],
        newImageUrls: ["a.webp", "b.webp", "c.webp"],
      }),
    ).toBe("b.webp");
  });
});
