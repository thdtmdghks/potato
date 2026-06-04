import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  configureActionMocks,
  mockAdminSession,
  mockUserSession,
} from "@/test-helpers/action-mocks";
import { createMockRepositories } from "@/server/mock";
import { REVIEW_STATUS } from "@/shared/constants";
import type { Repositories } from "@/server/repositories";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));
vi.mock("@/server", () => ({
  getServerRepositories: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("@/server/logger", () => ({
  logError: vi.fn(),
  logWarn: vi.fn(),
}));

let repos: Repositories;

beforeEach(async () => {
  vi.clearAllMocks();
  repos = createMockRepositories();
  await configureActionMocks(repos, mockAdminSession());
});

// vi.mock 이후 dynamic import로 mocked 모듈을 사용하는 action을 가져옴
const importActions = async () => await import("./_actions");

describe("approveReview", () => {
  it("관리자가 승인하면 리뷰 상태가 approved로 변경된다", async () => {
    const { approveReview } = await importActions();
    const pending = await repos.reviews.getAllPending();
    const target = pending[0];

    const result = await approveReview(target.id, target.images[0] ?? null);

    expect(result.success).toBe(true);
    const updated = await repos.reviews.getById(target.id);
    expect(updated?.status).toBe(REVIEW_STATUS.APPROVED);
  });

  it("존재하지 않는 리뷰 ID로 승인하면 실패를 반환한다", async () => {
    const { approveReview } = await importActions();
    const result = await approveReview("non-existent-id", null);
    expect(result.success).toBe(false);
  });

  it("비관리자가 시도하면 에러를 반환한다", async () => {
    await configureActionMocks(repos, mockUserSession());
    const { approveReview } = await importActions();
    const result = await approveReview("any-id", null);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("관리자 권한");
    }
  });
});

describe("deleteReview", () => {
  it("관리자가 삭제하면 리뷰 상태가 deleted로 변경된다", async () => {
    const { deleteReview } = await importActions();
    const pending = await repos.reviews.getAllPending();
    const target = pending[0];

    const result = await deleteReview(target.id);

    expect(result.success).toBe(true);
    const updated = await repos.reviews.getById(target.id);
    expect(updated?.status).toBe(REVIEW_STATUS.DELETED);
  });

  it("존재하지 않는 리뷰 ID로 삭제하면 실패를 반환한다", async () => {
    const { deleteReview } = await importActions();
    const result = await deleteReview("non-existent-id");
    expect(result.success).toBe(false);
  });
});

describe("approveReviewEdit", () => {
  it("수정 승인 시 원본 리뷰가 수정안 내용으로 덮어써지고 edit이 삭제된다", async () => {
    const { approveReviewEdit } = await importActions();

    const approved = (await repos.reviews.getAllApproved())[0];
    if (!approved) return;

    await repos.reviewEdits.upsert({
      review_id: approved.id,
      content: "수정된 내용",
      images: ["new-img.webp"],
      primary_image: "new-img.webp",
      rating: 4,
    });

    const result = await approveReviewEdit(approved.id);

    expect(result.success).toBe(true);
    const updated = await repos.reviews.getById(approved.id);
    expect(updated?.content).toBe("수정된 내용");
    expect(updated?.images).toEqual(["new-img.webp"]);

    const edit = await repos.reviewEdits.getById(approved.id);
    expect(edit).toBeNull();
  });

  it("수정 대기 항목이 없으면 실패를 반환한다", async () => {
    const { approveReviewEdit } = await importActions();
    const result = await approveReviewEdit("no-edit-review-id");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("수정 대기 항목");
    }
  });
});

describe("rejectReviewEdit", () => {
  it("수정 반려 시 edit만 삭제되고 원본은 유지된다", async () => {
    const { rejectReviewEdit } = await importActions();

    const approved = (await repos.reviews.getAllApproved())[0];
    if (!approved) return;

    await repos.reviewEdits.upsert({
      review_id: approved.id,
      content: "수정 제안",
      images: [],
      primary_image: null,
      rating: 3,
    });

    const originalContent = approved.content;
    const result = await rejectReviewEdit(approved.id);

    expect(result.success).toBe(true);
    const unchanged = await repos.reviews.getById(approved.id);
    expect(unchanged?.content).toBe(originalContent);

    const edit = await repos.reviewEdits.getById(approved.id);
    expect(edit).toBeNull();
  });

  it("삭제할 edit이 없으면 실패를 반환한다", async () => {
    const { rejectReviewEdit } = await importActions();
    const result = await rejectReviewEdit("no-edit-id");
    expect(result.success).toBe(false);
  });
});
