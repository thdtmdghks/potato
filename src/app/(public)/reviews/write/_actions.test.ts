import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureActionMocks, mockUserSession, mockNoSession } from "@/test-helpers/action-mocks";
import { createMockRepositories } from "@/server/mock";
import { REVIEW_STATUS } from "@/shared/constants";
import { FORM_KEYS } from "./_constants";
import { generateUUIDv7 } from "@/shared/utils";
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
vi.mock("@/server/storage-utils", () => ({
  uploadImages: vi.fn().mockResolvedValue(["uploaded-img.webp"]),
  deleteImages: vi.fn(),
}));

let repos: Repositories;
const USER_KAKAO_ID = "test-user-kakao";

beforeEach(async () => {
  vi.clearAllMocks();
  repos = createMockRepositories();
  await configureActionMocks(repos, mockUserSession(USER_KAKAO_ID));

  // storage-utils mock 재설정 (clearAllMocks가 반환값을 지우므로)
  const { uploadImages } = await import("@/server/storage-utils");
  vi.mocked(uploadImages).mockResolvedValue(["uploaded-img.webp"]);
});

const createReviewFormData = (overrides?: { content?: string; rating?: number }) => {
  const fd = new FormData();
  fd.set(FORM_KEYS.content, overrides?.content ?? "정말 좋은 시공이었습니다. 만족합니다.");
  fd.set(FORM_KEYS.rating, String(overrides?.rating ?? 5));
  fd.append(FORM_KEYS.images, new File(["img"], "test.webp", { type: "image/webp" }));
  return fd;
};

const importActions = async () => await import("./_actions");

describe("submitReview", () => {
  it("비로그인 상태에서 시도하면 인증 에러를 반환한다", async () => {
    await configureActionMocks(repos, mockNoSession());
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    const result = await submitReview(id, createReviewFormData());

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("인증");
  });

  it("만료된 UUID로 신규 작성 시도하면 만료 에러를 반환한다", async () => {
    const { submitReview } = await importActions();
    // 8일 전 UUID 생성 (만료)
    const expiredTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const hex = Math.floor(expiredTimestamp).toString(16).padStart(12, "0");
    const expiredId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7000-9000-000000000000`;

    const result = await submitReview(expiredId, createReviewFormData());

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("만료");
  });

  it("content가 5자 미만이면 Zod 검증 실패를 반환한다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    const result = await submitReview(id, createReviewFormData({ content: "짧음" }));

    expect(result.success).toBe(false);
  });

  it("rating이 범위를 벗어나면 검증 실패를 반환한다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    const result = await submitReview(id, createReviewFormData({ rating: 0 }));

    expect(result.success).toBe(false);
  });

  it("이미지가 0장이면 에러를 반환한다", async () => {
    const { uploadImages } = await import("@/server/storage-utils");
    vi.mocked(uploadImages).mockResolvedValue([]);

    const { submitReview } = await importActions();
    const id = generateUUIDv7();
    const fd = new FormData();
    fd.set(FORM_KEYS.content, "좋은 시공이었습니다. 감사합니다.");
    fd.set(FORM_KEYS.rating, "5");

    const result = await submitReview(id, fd);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("사진");
  });

  it("신규 등록 성공 시 리뷰가 pending 상태로 생성된다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    const result = await submitReview(id, createReviewFormData());

    expect(result.success).toBe(true);
    const created = await repos.reviews.getById(id);
    expect(created).not.toBeNull();
    expect(created?.status).toBe(REVIEW_STATUS.PENDING);
    expect(created?.kakao_id).toBe(USER_KAKAO_ID);
  });

  it("타인의 리뷰를 수정하려 하면 권한 에러를 반환한다", async () => {
    const { submitReview } = await importActions();
    // mock에 있는 기존 리뷰 (다른 사용자 소유)
    const existingReviews = await repos.reviews.getAllPending();
    const otherUserReview = existingReviews[0];

    if (!otherUserReview) return;

    const result = await submitReview(otherUserReview.id, createReviewFormData());

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("권한");
  });

  it("DELETED 상태의 리뷰를 수정하려 하면 에러를 반환한다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    // 본인 리뷰를 생성 후 삭제 상태로 변경
    await repos.reviews.create({
      id,
      kakao_id: USER_KAKAO_ID,
      author_name: "고객",
      author_avatar: "",
      content: "원본 내용입니다 길게 작성",
      images: ["img.webp"],
      primary_image: null,
      rating: 5,
    });
    await repos.reviews.update(id, { status: REVIEW_STATUS.DELETED });

    const result = await submitReview(id, createReviewFormData());

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("무효화");
  });

  it("pending 상태의 본인 리뷰를 수정하면 내용이 업데이트된다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    // 본인 리뷰 생성
    await repos.reviews.create({
      id,
      kakao_id: USER_KAKAO_ID,
      author_name: "고객",
      author_avatar: "",
      content: "원본 내용입니다 길게 작성",
      images: ["old-img.webp"],
      primary_image: null,
      rating: 4,
    });

    const result = await submitReview(
      id,
      createReviewFormData({ content: "수정된 내용입니다 더 길게" }),
    );

    expect(result.success).toBe(true);
    const updated = await repos.reviews.getById(id);
    expect(updated?.content).toBe("수정된 내용입니다 더 길게");
  });

  it("approved 상태의 본인 리뷰를 수정하면 review_edits에 upsert된다", async () => {
    const { submitReview } = await importActions();
    const id = generateUUIDv7();

    // 본인 리뷰를 approved 상태로 생성
    await repos.reviews.create({
      id,
      kakao_id: USER_KAKAO_ID,
      author_name: "고객",
      author_avatar: "",
      content: "승인된 원본 내용 길게",
      images: ["img.webp"],
      primary_image: null,
      rating: 5,
    });
    await repos.reviews.update(id, { status: REVIEW_STATUS.APPROVED });

    const result = await submitReview(
      id,
      createReviewFormData({ content: "수정 요청 내용입니다 길게 작성" }),
    );

    expect(result.success).toBe(true);
    const edit = await repos.reviewEdits.getById(id);
    expect(edit).not.toBeNull();
    expect(edit?.content).toBe("수정 요청 내용입니다 길게 작성");

    // 원본은 그대로
    const original = await repos.reviews.getById(id);
    expect(original?.content).toBe("승인된 원본 내용 길게");
  });
});
