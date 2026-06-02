import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewForm } from "./review-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("../_actions", () => ({
  submitReview: vi.fn().mockResolvedValue({ success: true }),
}));

const mockUseImageUpload = vi.fn();

vi.mock("@/client/use-image-upload", () => ({
  useImageUpload: (...args: unknown[]) => mockUseImageUpload(...args),
}));
vi.mock("@/app/_components/image-upload", () => ({
  ImageUpload: () => <div data-testid="image-upload-mock" />,
}));

const defaultProps = {
  id: "test-uuid",
  initialData: null,
  isApproved: false,
  userProfile: { name: "테스트 유저", image: null },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseImageUpload.mockReturnValue({
    existingImages: [],
    compressedFiles: [],
    previews: [],
    compressing: false,
    handleFiles: vi.fn(),
    removeExisting: vi.fn(),
    removeNew: vi.fn(),
  });
});

describe("ReviewForm", () => {
  it("content가 5자 미만이면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    const textarea = screen.getByLabelText(/상세한 후기/);
    await user.type(textarea, "짧음");

    const submitButton = screen.getByText("후기 등록하기");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/최소 5자 이상 입력/)).toBeInTheDocument();
    });
  });

  it("이미지가 없을 때 제출하면 사진 필수 에러를 표시한다", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    const textarea = screen.getByLabelText(/상세한 후기/);
    await user.type(textarea, "충분히 긴 후기 내용입니다");

    const submitButton = screen.getByText("후기 등록하기");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/최소 1장 이상/)).toBeInTheDocument();
    });
  });

  it("compressing 중이면 제출 버튼이 비활성화된다", () => {
    mockUseImageUpload.mockReturnValue({
      existingImages: [],
      compressedFiles: [],
      previews: [],
      compressing: true,
      handleFiles: vi.fn(),
      removeExisting: vi.fn(),
      removeNew: vi.fn(),
    });

    render(<ReviewForm {...defaultProps} />);
    const submitButton = screen.getByText("후기 등록하기");
    expect(submitButton).toBeDisabled();
  });

  it("별점 클릭 시 선택된 점수가 표시된다", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    const star3 = screen.getByLabelText("별점 3점 설정");
    await user.click(star3);

    expect(screen.getByText(/3점/)).toBeInTheDocument();
    expect(screen.getByText(/보통/)).toBeInTheDocument();
  });
});
