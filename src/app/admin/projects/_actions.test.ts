import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { configureActionMocks, mockAdminSession, mockNoSession } from "@/test-helpers/action-mocks";
import { createMockRepositories } from "@/server/mock";
import { FORM_KEYS } from "./_constants";
import type { Repositories } from "@/server/repositories";
import { resetCachedAiService } from "@/server/ai/factory";
import { AI_CONFIG, BUSINESS } from "@/shared/constants";

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

interface CreateValidFormDataOverrides {
  title?: string;
  description?: string;
  categories?: string[] | null;
  region?: string | null;
  buildingType?: string | null;
}

const createValidFormData = (overrides?: CreateValidFormDataOverrides) => {
  const fd = new FormData();
  fd.set(FORM_KEYS.title, overrides?.title ?? "테스트 프로젝트");
  fd.set(FORM_KEYS.description, overrides?.description ?? "설명입니다");
  if (overrides && "categories" in overrides) {
    if (overrides.categories !== null && Array.isArray(overrides.categories)) {
      overrides.categories.forEach((cat: string) => fd.append(FORM_KEYS.categories, cat));
    }
  } else {
    fd.append(FORM_KEYS.categories, "하이샤시");
  }
  fd.set(FORM_KEYS.region, overrides?.region ?? "경산시");
  fd.set(FORM_KEYS.buildingType, overrides?.buildingType ?? "아파트");
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
    const fd = createValidFormData({ categories: [] });

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

describe("generateAiDescription", () => {
  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  const originalAiProvider = process.env.AI_PROVIDER;
  const originalAiApiKey = process.env.AI_API_KEY;
  const originalAiModel = process.env.AI_MODEL;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = undefined;
    process.env.GEMINI_API_KEY = undefined;
    process.env.AI_PROVIDER = undefined;
    process.env.AI_API_KEY = undefined;
    process.env.AI_MODEL = undefined;
    resetCachedAiService();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalOpenAiKey;
    process.env.GEMINI_API_KEY = originalGeminiKey;
    process.env.AI_PROVIDER = originalAiProvider;
    process.env.AI_API_KEY = originalAiApiKey;
    process.env.AI_MODEL = originalAiModel;
    resetCachedAiService();
  });

  it("API Key가 없을 경우 로컬 Fallback 설명글을 생성하고 isFallback: true를 반환한다", async () => {
    const { generateAiDescription } = await importActions();

    const result = await generateAiDescription({
      region: "경산 사동",
      buildingType: "아파트",
      categories: ["하이샤시", "방충망"],
      details: "샤시 및 방충망 교체 완료",
    });

    expect(result.success).toBe(true);
    expect(result.isFallback).toBe(true);
    expect(result.description).toContain("경산 사동 아파트 하이샤시, 방충망 시공 사례입니다.");
    expect(result.description).toContain("샤시 및 방충망 교체 완료.");
    expect(result.description).toContain(`- ${BUSINESS.name}`);
    expect(result.suggestedTitle).toBe("경산 사동 아파트 하이샤시 시공");
  });

  it("AI_PROVIDER가 gemini이고 API가 성공하면 구글 Gemini가 생성한 설명글과 isFallback: false를 반환한다", async () => {
    process.env.AI_PROVIDER = AI_CONFIG.PROVIDERS.GEMINI;
    process.env.AI_API_KEY = "test-gemini-key";
    resetCachedAiService();

    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  proposals: [
                    {
                      description: `Gemini가 생성한 시공사례 설명글입니다.\n- ${BUSINESS.name}`,
                      suggestedTitle: "경산 사동 아파트 하이샤시 시공",
                    },
                    {
                      description: `Gemini가 제안한 2번째 안입니다.\n- ${BUSINESS.name}`,
                      suggestedTitle: "경산 사동 아파트 창호 교체",
                    },
                    {
                      description: `Gemini가 제안한 3번째 안입니다.\n- ${BUSINESS.name}`,
                      suggestedTitle: "경산 사동 하이샤시 시공완료",
                    },
                  ],
                }),
              },
            ],
          },
        },
      ],
    };

    const spyFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { generateAiDescription } = await importActions();

    const result = await generateAiDescription({
      region: "경산 사동",
      buildingType: "아파트",
      categories: ["하이샤시"],
      details: "샤시 교체 완료",
      images: ["base64-image-string-test"],
    });

    expect(spyFetch).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.isFallback).toBe(false);
    expect(result.description).toBe(`Gemini가 생성한 시공사례 설명글입니다.\n- ${BUSINESS.name}`);
    expect(result.suggestedTitle).toBe("경산 사동 아파트 하이샤시 시공");
  });

  it("AI_PROVIDER가 openai이고 API가 성공하면 OpenAI GPT가 생성한 설명글과 isFallback: false를 반환한다", async () => {
    process.env.AI_PROVIDER = AI_CONFIG.PROVIDERS.OPENAI;
    process.env.AI_API_KEY = "test-openai-key";
    resetCachedAiService();

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              proposals: [
                {
                  description: `GPT가 생성한 시공사례 설명글입니다.\n- ${BUSINESS.name}`,
                  suggestedTitle: "대구 수성구 빌라 유리 교체 시공",
                },
                {
                  description: `GPT가 제안한 2번째 안입니다.\n- ${BUSINESS.name}`,
                  suggestedTitle: "대구 수성구 빌라 유리 시공",
                },
                {
                  description: `GPT가 제안한 3번째 안입니다.\n- ${BUSINESS.name}`,
                  suggestedTitle: "대구 수성구 유리 교체 공사",
                },
              ],
            }),
          },
        },
      ],
    };

    const spyFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { generateAiDescription } = await importActions();

    const result = await generateAiDescription({
      region: "대구 수성구",
      buildingType: "빌라",
      categories: ["유리"],
      details: "유리 교체 완료",
      images: ["base64-image-string-test"],
    });

    expect(spyFetch).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.isFallback).toBe(false);
    expect(result.description).toBe(`GPT가 생성한 시공사례 설명글입니다.\n- ${BUSINESS.name}`);
    expect(result.suggestedTitle).toBe("대구 수성구 빌라 유리 교체 시공");
  });

  it("API 호출에 실패하면 로컬 Fallback 설명글을 생성하고 isFallback: true를 반환한다", async () => {
    process.env.AI_PROVIDER = AI_CONFIG.PROVIDERS.GEMINI;
    process.env.AI_API_KEY = "test-gemini-key";
    resetCachedAiService();

    const spyFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    } as Response);

    const { generateAiDescription } = await importActions();

    const result = await generateAiDescription({
      region: "경산",
      buildingType: "주택",
      categories: ["ABS도어"],
      details: "방문 교체",
    });

    expect(spyFetch).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.isFallback).toBe(true);
    expect(result.description).toContain("경산 주택 ABS도어 시공 사례입니다.");
    expect(result.suggestedTitle).toBe("경산 주택 ABS도어 시공");
  });
});
