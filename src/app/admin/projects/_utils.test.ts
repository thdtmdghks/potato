import { describe, it, expect, vi } from "vitest";
import { resolvePrimaryImage, fileToBase64 } from "./_utils";

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

describe("fileToBase64", () => {
  it("파일 객체를 base64 데이터 URL로 올바르게 변환한다", async () => {
    const content = "hello world";
    const file = new File([content], "hello.txt", { type: "text/plain" });

    const result = await fileToBase64(file);

    expect(result).toContain("data:text/plain;base64,");
    // "hello world"의 base64 인코딩 결과는 "aGVsbG8gd29ybGQ=" 입니다.
    expect(result).toContain("aGVsbG8gd29ybGQ=");
  });

  it("에러 발생 시 Promise가 Reject되어야 한다", async () => {
    const file = new File(["error test"], "error.txt", { type: "text/plain" });

    const readSpy = vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(function (
      this: FileReader,
    ) {
      if (this.onerror) {
        // mock Error 자체를 ProgressEvent 인자 대신 강제로 전달하여 reject에 들어가게 함
        const mockError = new Error("Mock FileReader Error");
        this.onerror(mockError as unknown as ProgressEvent<FileReader>);
      }
    });

    await expect(fileToBase64(file)).rejects.toThrow("Mock FileReader Error");
    readSpy.mockRestore();
  });
});
