import { describe, it, expect, vi } from "vitest";
import { isValidUUIDv7, getReviewWriteState } from "./_utils";
import type { ReviewWriteDeps } from "./_types";
import { ROUTES } from "@/shared/routes";
import { generateUUIDv7 } from "@/shared/utils";

// 10일 전 생성된 만료된 UUID v7 생성 도우미
function generateExpiredUUIDv7(): string {
  const timestamp = Date.now() - 10 * 24 * 60 * 60 * 1000; // 10일 전
  const tsHex = timestamp.toString(16).padStart(12, "0");
  const randomBytes = new Uint8Array(10);
  for (let i = 0; i < 10; i++) randomBytes[i] = i;
  const rHex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");

  const part1 = tsHex.slice(0, 8);
  const part2 = tsHex.slice(8, 12);
  const part3 = "7" + rHex.slice(0, 3);
  const part4 = ((parseInt(rHex.slice(3, 4), 16) & 0x3) | 0x8).toString(16) + rHex.slice(4, 7);
  const part5 = rHex.slice(7, 19);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

describe("isValidUUIDv7", () => {
  it("올바른 형식의 UUID v4를 넣으면 false를 반환한다", () => {
    const validUUID = "a5e8b4e7-4952-4752-87ad-d094e8e12fa6";
    expect(isValidUUIDv7(validUUID)).toBe(false);
  });

  it("올바른 형식의 UUID v7을 넣으면 true를 반환한다", () => {
    const validUUIDv7 = generateUUIDv7();
    expect(isValidUUIDv7(validUUIDv7)).toBe(true);
  });

  it("대문자가 섞인 올바른 형식의 UUID v7을 넣어도 true를 반환한다", () => {
    const validUUIDv7 = generateUUIDv7().toUpperCase();
    expect(isValidUUIDv7(validUUIDv7)).toBe(true);
  });

  it("빈 문자열을 넣으면 false를 반환한다", () => {
    expect(isValidUUIDv7("")).toBe(false);
  });

  it("길이가 잘못되었거나 형식이 다른 문자열은 false를 반환한다", () => {
    expect(isValidUUIDv7("invalid-uuid-string")).toBe(false);
    expect(isValidUUIDv7("12345678-1234-1234-1234-1234567890ab")).toBe(false);
  });
});

describe("getReviewWriteState", () => {
  const validId = generateUUIDv7();

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

  it("UUID v7 형식이지만 만료 기간(1주일)을 넘기면 만료 사유와 함께 INVALID_LINK를 반환한다", async () => {
    const deps = createMockDeps();
    const expiredId = generateExpiredUUIDv7();
    const session = { kakaoId: "my-user", user: { name: "홍길동", image: "avatar.jpg" } };
    const state = await getReviewWriteState(expiredId, session, deps);
    expect(state).toEqual({
      type: "INVALID_LINK",
      title: "만료된 링크",
      description: "해당 리뷰 작성 링크의 유효 기간(1주일)이 만료되었습니다.",
    });
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

  it("기존 후기가 존재하지만 status가 rejected인 경우 사용할 수 없는 링크 에러와 함께 INVALID_LINK를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "my-user",
          status: "rejected",
          content: "반려된 내용",
          images: [],
        }),
      },
    });
    const session = { kakaoId: "my-user" };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "INVALID_LINK",
      title: "사용할 수 없는 링크",
      description: "관리자에 의해 반려되었거나 이미 무효화된 후기 링크입니다.",
    });
  });

  it("기존 후기가 존재하지만 status가 deleted인 경우 사용할 수 없는 링크 에러와 함께 INVALID_LINK를 반환한다", async () => {
    const deps = createMockDeps({
      reviews: {
        getById: vi.fn().mockResolvedValue({
          id: validId,
          kakao_id: "my-user",
          status: "deleted",
          content: "삭제된 내용",
          images: [],
        }),
      },
    });
    const session = { kakaoId: "my-user" };

    const state = await getReviewWriteState(validId, session, deps);
    expect(state).toEqual({
      type: "INVALID_LINK",
      title: "사용할 수 없는 링크",
      description: "관리자에 의해 반려되었거나 이미 무효화된 후기 링크입니다.",
    });
  });
});
