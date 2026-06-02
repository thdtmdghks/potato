/**
 * Server Action 통합 테스트용 공용 mock 헬퍼.
 *
 * 사용법:
 * ```ts
 * import { setupActionMocks, mockAdminSession, mockUserSession, mockNoSession } from "@/test-helpers/action-mocks";
 *
 * const { repos, authMock } = setupActionMocks();
 *
 * beforeEach(() => {
 *   authMock.mockReturnValue(mockAdminSession());
 * });
 * ```
 */
import { vi } from "vitest";
import { createMockRepositories } from "@/server/mock";
import { USER_ROLE } from "@/shared/constants";
import type { Repositories } from "@/server/repositories";

// --- 세션 헬퍼 ---

export const mockAdminSession = (kakaoId = "admin-kakao-id") => ({
  kakaoId,
  role: USER_ROLE.ADMIN,
  user: { name: "관리자", image: "https://example.com/admin.jpg" },
});

export const mockUserSession = (kakaoId = "user-kakao-id") => ({
  kakaoId,
  role: USER_ROLE.USER,
  user: { name: "고객", image: "https://example.com/user.jpg" },
});

export const mockNoSession = () => null;

// --- Mock 세팅 ---

/**
 * Server Action 테스트에 필요한 모든 외부 의존성을 mock하고,
 * 새 Mock Repository 인스턴스를 반환합니다.
 *
 * 반환된 `authMock`으로 테스트별 세션을 제어합니다.
 */
export const setupActionMocks = () => {
  const repos: Repositories = createMockRepositories();

  // next/cache mock
  vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
  }));

  // @/server mock — getServerRepositories가 테스트용 repos 반환
  vi.mock("@/server", () => ({
    getServerRepositories: vi.fn(),
  }));

  // @/auth mock
  vi.mock("@/auth", () => ({
    auth: vi.fn(),
  }));

  // @/server/logger mock
  vi.mock("@/server/logger", () => ({
    logError: vi.fn(),
    logWarn: vi.fn(),
  }));

  return { repos };
};

/**
 * beforeEach에서 호출하여 repos와 session을 설정합니다.
 */
export const configureActionMocks = async (
  repos: Repositories,
  session: ReturnType<typeof mockAdminSession> | ReturnType<typeof mockNoSession>,
) => {
  const { getServerRepositories } = await import("@/server");
  const { auth } = await import("@/auth");

  vi.mocked(getServerRepositories).mockResolvedValue(repos);
  vi.mocked(auth).mockResolvedValue(session as Awaited<ReturnType<typeof auth>>);
};
