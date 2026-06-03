import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImageUpload } from "./use-image-upload";
import type { ChangeEvent } from "react";

vi.mock("./image", () => ({
  compressImage: vi.fn(async (file: File) => file),
}));

import { compressImage } from "./image";

describe("useImageUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("기본 상태를 초기화한다", () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.compressedFiles).toEqual([]);
    expect(result.current.previews).toEqual([]);
    expect(result.current.compressing).toBe(false);
  });

  it("일반 이미지를 정상적으로 추가한다", async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = new File(["test"], "image.png", { type: "image/png" });

    await act(async () => {
      await result.current.handleFiles({
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.compressedFiles).toHaveLength(1);
    expect(result.current.previews).toEqual(["mock-url"]);
  });

  it("20MB 초과 원본 이미지는 에러 메시지와 함께 추가하지 않는다", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useImageUpload({ onError }));
    const largeFile = new File([new ArrayBuffer(21 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });

    await act(async () => {
      await result.current.handleFiles({
        target: { files: [largeFile] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining(
        "파일이 너무 큽니다. 20MB 이하의 이미지 파일만 업로드할 수 있습니다.",
      ),
    );
    expect(result.current.compressedFiles).toHaveLength(0);
  });

  it("압축 후 총 용량이 8MB를 초과하는 파일들은 에러 메시지와 함께 추가하지 않는다", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useImageUpload({ onError }));

    // Mock compressImage to return a file of 5MB
    const file5MB = new File([new ArrayBuffer(5 * 1024 * 1024)], "5mb.png", { type: "image/png" });
    vi.mocked(compressImage).mockResolvedValue(file5MB);

    const file1 = new File([""], "1.png", { type: "image/png" });
    const file2 = new File([""], "2.png", { type: "image/png" });

    // Try uploading 2 files of 5MB each (total 10MB, which exceeds 8MB)
    await act(async () => {
      await result.current.handleFiles({
        target: { files: [file1, file2] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    // The first 5MB file is fine. The second 5MB file pushes the total to 10MB (>8MB), so it is blocked.
    expect(result.current.compressedFiles).toHaveLength(1);
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining(
        "첨부할 이미지의 총 용량이 8MB를 초과하여 일부 이미지가 추가되지 않았습니다.",
      ),
    );
  });

  it("이미지가 아닌 파일은 에러 메시지와 함께 추가하지 않는다", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useImageUpload({ onError }));
    const pdfFile = new File(["test"], "document.pdf", { type: "application/pdf" });

    await act(async () => {
      await result.current.handleFiles({
        target: { files: [pdfFile] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining("이미지 파일만 업로드할 수 있습니다."),
    );
    expect(result.current.compressedFiles).toHaveLength(0);
  });
});
