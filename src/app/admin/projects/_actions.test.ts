import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureActionMocks, mockAdminSession, mockNoSession } from "@/test-helpers/action-mocks";
import { createMockRepositories } from "@/server/mock";
import { FORM_KEYS } from "./_constants";
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
  uploadImages: vi.fn().mockResolvedValue([]),
  deleteImages: vi.fn(),
}));

let repos: Repositories;

beforeEach(async () => {
  vi.clearAllMocks();
  repos = createMockRepositories();
  await configureActionMocks(repos, mockAdminSession());
});

const createValidFormData = (overrides?: Record<string, string>) => {
  const fd = new FormData();
  fd.set(FORM_KEYS.title, overrides?.title ?? "테스트 프로젝트");
  fd.set(FORM_KEYS.description, overrides?.description ?? "설명입니다");
  fd.set(FORM_KEYS.category, overrides?.category ?? "하이샤시");
  return fd;
};

const importActions = async () => await import("./_actions");

describe("createProject", () => {
  it("관리자가 유효한 데이터로 생성하면 성공을 반환한다", async () => {
    const { createProject } = await importActions();
    const before = (await repos.projects.getAll()).length;

    const result = await createProject(createValidFormData());

    expect(result.success).toBe(true);
    expect((await repos.projects.getAll()).length).toBe(before + 1);
  });

  it("비인증 상태에서 시도하면 에러를 반환한다", async () => {
    await configureActionMocks(repos, mockNoSession());
    const { createProject } = await importActions();

    const result = await createProject(createValidFormData());

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("인증");
    }
  });

  it("제목이 비어있으면 Zod 검증 실패를 반환한다", async () => {
    const { createProject } = await importActions();
    const fd = createValidFormData({ title: "" });

    const result = await createProject(fd);

    expect(result.success).toBe(false);
  });

  it("카테고리가 비어있으면 Zod 검증 실패를 반환한다", async () => {
    const { createProject } = await importActions();
    const fd = createValidFormData({ category: "" });

    const result = await createProject(fd);

    expect(result.success).toBe(false);
  });
});

describe("updateProject", () => {
  it("유효한 데이터로 수정하면 성공을 반환한다", async () => {
    const { updateProject } = await importActions();
    const projects = await repos.projects.getAll();
    const target = projects[0];

    const fd = createValidFormData({ title: "수정된 제목" });
    const result = await updateProject(target.id, fd);

    expect(result.success).toBe(true);
    const updated = await repos.projects.getById(target.id);
    expect(updated?.title).toBe("수정된 제목");
  });

  it("비인증 상태에서 시도하면 에러를 반환한다", async () => {
    await configureActionMocks(repos, mockNoSession());
    const { updateProject } = await importActions();

    const result = await updateProject("any-id", createValidFormData());

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("인증");
    }
  });

  it("존재하지 않는 프로젝트 ID로 수정하면 에러를 반환한다", async () => {
    const { updateProject } = await importActions();
    const result = await updateProject("non-existent-id", createValidFormData());

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("찾을 수 없습니다");
    }
  });
});

describe("deleteProject", () => {
  it("존재하는 프로젝트를 삭제하면 성공을 반환한다", async () => {
    const { deleteProject } = await importActions();
    const projects = await repos.projects.getAll();
    const target = projects[0];

    const result = await deleteProject(target.id);

    expect(result.success).toBe(true);
    const deleted = await repos.projects.getById(target.id);
    expect(deleted).toBeNull();
  });

  it("비인증 상태에서 시도하면 에러를 반환한다", async () => {
    await configureActionMocks(repos, mockNoSession());
    const { deleteProject } = await importActions();

    const result = await deleteProject("any-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("인증");
    }
  });

  it("존재하지 않는 프로젝트 ID로 삭제하면 실패를 반환한다", async () => {
    const { deleteProject } = await importActions();
    const result = await deleteProject("non-existent-id");

    expect(result.success).toBe(false);
  });
});
