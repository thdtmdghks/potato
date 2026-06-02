import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUpload } from "./image-upload";

vi.mock("./image-thumbnail", () => ({
  ImageThumbnail: ({ url, onRemove }: { url: string; onRemove: () => void }) => (
    <div data-testid={`thumbnail-${url}`}>
      <button onClick={onRemove} aria-label="삭제">
        ×
      </button>
    </div>
  ),
}));
vi.mock("./lightbox-modal", () => ({
  LightboxModal: () => null,
}));

const defaultProps = {
  existingImages: [] as string[],
  previews: [] as string[],
  compressing: false,
  maxCount: 5,
  onFilesChange: vi.fn(),
  onRemoveExisting: vi.fn(),
  onRemoveNew: vi.fn(),
};

describe("ImageUpload", () => {
  it("maxCount에 도달하면 업로드 영역이 사라진다", () => {
    render(
      <ImageUpload
        {...defaultProps}
        existingImages={["img1.webp", "img2.webp", "img3.webp"]}
        previews={["new1.webp", "new2.webp"]}
        maxCount={5}
      />,
    );

    // 5장 = maxCount → 업로드 input 없어야 함
    const fileInput = screen.queryByLabelText(/추가/);
    expect(fileInput).not.toBeInTheDocument();
  });

  it("maxCount 미만이면 업로드 영역이 보인다", () => {
    render(
      <ImageUpload {...defaultProps} existingImages={["img1.webp"]} previews={[]} maxCount={5} />,
    );

    // input[type=file]이 존재해야 함
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it("기존 이미지 삭제 버튼 클릭 시 onRemoveExisting이 호출된다", async () => {
    const user = userEvent.setup();
    const onRemoveExisting = vi.fn();

    render(
      <ImageUpload
        {...defaultProps}
        existingImages={["existing.webp"]}
        onRemoveExisting={onRemoveExisting}
      />,
    );

    const removeBtn = screen.getByLabelText("삭제");
    await user.click(removeBtn);

    expect(onRemoveExisting).toHaveBeenCalledWith(0);
  });

  it("새 이미지 삭제 버튼 클릭 시 onRemoveNew가 호출된다", async () => {
    const user = userEvent.setup();
    const onRemoveNew = vi.fn();

    render(<ImageUpload {...defaultProps} previews={["preview.webp"]} onRemoveNew={onRemoveNew} />);

    const removeBtn = screen.getByLabelText("삭제");
    await user.click(removeBtn);

    expect(onRemoveNew).toHaveBeenCalledWith(0);
  });
});
