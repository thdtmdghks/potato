import { describe, it, expect, vi } from "vitest";
import { isValidUUID, getReviewWriteState } from "./_utils";
import type { ReviewWriteDeps } from "./_types";
import { ROUTES } from "@/shared/routes";

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

describe("getReviewWriteState", () => {
  const validId = "a5e8b4e7-4952-4752-87ad-d094e8e12fa6";

  const createMockDeps = (overrides?: Partial<ReviewWriteDeps>): ReviewWriteDeps => ({
    reviews: {
      getById: vi.fn().mockResolvedValue(null),
      ...overrides?.reviews,
    },
    reviewEdits: {
      getById: vi.fn().mockResolvedValue(null),
      ...overrides?.reviewEdits,
    },
  });

  it("UUID가 올바르지 않으면 INVALID_LINK 상태를 반환한다", async () => {
    const deps = createMockDeps();
    const state = await getReviewWriteState("invalid-uuid", null, deps);
    expect(state).toEqual({ type: "INVALID_LINK" });
  });

  it("로그인하지 않은 상태이면 AUTH_REQUIRED 상태를 반환한다", async () => {
    const deps = createMockDeps();
    const state = await getReviewWriteState(validId, null, deps);
    expect(state).toEqual({
      type: "AUTH_REQUIRED",
      redirectTo: ROUTES.writeReview(validId),
    });
  });

  it("기존 후기가 존재하지만 로그인된 카카오 ID와 다르면 UNAUTHORIZED 상태를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "other-user",
          status: "pending",
          content: "원래 내용",
          images: [],
        }),
      },
    });

    const state = await getReviewWriteState(validId, { kakaoId: "my-user" }, deps);
    expect(state).toEqual({ type: "UNAUTHORIZED" });
  });

  it("기존 후기가 없으면 READY 상태이고 initialData는 null이다", async () => {
    const deps = createMockDeps();
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "READY",
      id: validId,
      initialData: null,
      isApproved: false,
      userProfile: { name: "홍길동", image: "avatar.jpg" },
    });
  });

  it("승인 대기 중(pending)인 본인 후기가 존재하면 해당 데이터를 initialData로 하는 READY 상태를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "my-user",
          status: "pending",
          content: "대기중인 원래 내용",
          images: ["img1.jpg"],
        }),
      },
    });
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "READY",
      id: validId,
      initialData: {
        content: "대기중인 원래 내용",
        images: ["img1.jpg"],
      },
      isApproved: false,
      userProfile: { name: "홍길동", image: "avatar.jpg" },
    });
  });

  it("이미 승인(approved)된 후기가 존재하고 대기 중인 수정 건이 없으면 원본 데이터를 initialData로 하는 READY 상태를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "my-user",
          status: "approved",
          content: "승인 완료된 내용",
          images: ["img1.jpg"],
        }),
      },
    });
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "READY",
      id: validId,
      initialData: {
        content: "승인 완료된 내용",
        images: ["img1.jpg"],
      },
      isApproved: true,
      userProfile: { name: "홍길동", image: "avatar.jpg" },
    });
  });

  it("이미 승인(approved)된 후기가 존재하고 대기 중인 수정 제안이 존재하면 수정 내용을 initialData로 하는 READY 상태를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "my-user",
          status: "approved",
          content: "승인 완료된 내용",
          images: ["img1.jpg"],
        }),
      },
      reviewEdits: {
        getById: vi.fn().mockResolvedValue({
          review_id: validId,
          content: "수정 제안된 내용",
          images: ["img1.jpg", "img2.jpg"],
        }),
      },
    });
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "READY",
      id: validId,
      initialData: {
        content: "수정 제안된 내용",
        images: ["img1.jpg", "img2.jpg"],
      },
      isApproved: true,
      userProfile: { name: "홍길동", image: "avatar.jpg" },
    });
  });
});
