import { describe, it, expect, vi } from "vitest";

vi.mock("browser-image-compression", () => ({
  default: vi.fn(async (file: File) => file),
}));

import { compressImage } from "@/client/image";

describe("compressImage", () => {
  it("File을 반환한다", async () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    const result = await compressImage(file);
    expect(result).toBeInstanceOf(File);
  });

  it("browser-image-compression을 호출한다", async () => {
    const { default: mockCompress } = await import("browser-image-compression");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    await compressImage(file);
    expect(mockCompress).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ maxSizeMB: 0.2, fileType: "image/webp" }),
    );
  });
});
