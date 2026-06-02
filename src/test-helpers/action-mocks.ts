/**
 * Server Action 통합 테스트용 공용 mock 헬퍼.
 *
 * 사용법:
 * ```ts
 * // 테스트 파일 top-level에서 vi.mock 선언
 * vi.mock("@/auth");
 * vi.mock("@/server");
 * vi.mock("next/cache");
 * vi.mock("@/server/logger");
 *
 * // beforeEach에서 세션과 repos 설정
 * const repos = createMockRepositories();
 * await configureActionMocks(repos, mockAdminSession());
 * ```
 */
import { vi } from "vitest";
import { USER_ROLE } from "@/shared/constants";
import type { Repositories } from "@/server/repositories";

// --- 타입 ---

interface MockSession {
  kakaoId: string;
  role: string;
  user: { name: string; image: string };
}

// --- 세션 헬퍼 ---

export const mockAdminSession = (kakaoId = "admin-kakao-id"): MockSession => ({
  kakaoId,
  role: USER_ROLE.ADMIN,
  user: { name: "관리자", image: "https://example.com/admin.jpg" },
});

export const mockUserSession = (kakaoId = "user-kakao-id"): MockSession => ({
  kakaoId,
  role: USER_ROLE.USER,
  user: { name: "고객", image: "https://example.com/user.jpg" },
});

export const mockNoSession = () => null;

// --- Mock 설정 ---

/**
 * beforeEach에서 호출하여 repos와 session을 설정합니다.
 */
export const configureActionMocks = async (repos: Repositories, session: MockSession | null) => {
  const { getServerRepositories } = await import("@/server");
  const { auth } = await import("@/auth");

  vi.mocked(getServerRepositories).mockResolvedValue(repos);
  (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(session);
};
