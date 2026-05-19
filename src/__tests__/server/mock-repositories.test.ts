import { describe, it, expect, beforeEach } from "vitest";
import {
  MockProjectRepository,
  MockProductRepository,
  MockInquiryRepository,
  MockStorageRepository,
} from "@/server/mock-repositories";

describe("MockProjectRepository", () => {
  let repo: MockProjectRepository;
  beforeEach(() => {
    repo = new MockProjectRepository();
  });

  it("getAll은 전체 목록을 반환한다", async () => {
    const all = await repo.getAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it("getAll(category)은 필터링된 목록을 반환한다", async () => {
    const filtered = await repo.getAll("웹");
    expect(filtered.every((p) => p.category === "웹")).toBe(true);
  });

  it("getById는 존재하는 항목을 반환한다", async () => {
    const item = await repo.getById("1");
    expect(item).not.toBeNull();
    expect(item?.id).toBe("1");
  });

  it("getById는 없는 항목에 null을 반환한다", async () => {
    expect(await repo.getById("nonexistent")).toBeNull();
  });

  it("getCategories는 중복 없는 카테고리 목록을 반환한다", async () => {
    const cats = await repo.getCategories();
    expect(cats.length).toBe(new Set(cats).size);
  });

  it("create는 새 항목을 추가한다", async () => {
    const before = (await repo.getAll()).length;
    const created = await repo.create({
      title: "새 프로젝트",
      description: "설명",
      category: "웹",
      images: [],
    });
    expect(created).not.toBeNull();
    expect((await repo.getAll()).length).toBe(before + 1);
  });

  it("update는 항목을 수정한다", async () => {
    const updated = await repo.update("1", { title: "수정됨" });
    expect(updated?.title).toBe("수정됨");
  });

  it("delete는 항목을 삭제한다", async () => {
    expect(await repo.delete("1")).toBe(true);
    expect(await repo.getById("1")).toBeNull();
  });

  it("delete는 없는 항목에 false를 반환한다", async () => {
    expect(await repo.delete("nonexistent")).toBe(false);
  });
});

describe("MockProductRepository", () => {
  let repo: MockProductRepository;
  beforeEach(() => {
    repo = new MockProductRepository();
  });

  it("getAll은 전체 목록을 반환한다", async () => {
    expect((await repo.getAll()).length).toBeGreaterThan(0);
  });

  it("CRUD가 동작한다", async () => {
    const created = await repo.create({
      name: "신규",
      description: "설명",
      category: "앱",
      image: "",
      features: [],
    });
    expect(created).not.toBeNull();
    const updated = await repo.update(created!.id, { name: "수정" });
    expect(updated?.name).toBe("수정");
    expect(await repo.delete(created!.id)).toBe(true);
  });
});

describe("MockInquiryRepository", () => {
  let repo: MockInquiryRepository;
  beforeEach(() => {
    repo = new MockInquiryRepository();
  });

  it("create는 status를 pending으로 설정한다", async () => {
    const created = await repo.create({
      name: "테스트",
      phone: "010-0000-0000",
      email: null,
      type: "웹",
      address: "서울",
      content: "문의",
    });
    expect(created?.status).toBe("pending");
  });

  it("updateStatus는 상태를 변경한다", async () => {
    expect(await repo.updateStatus("1", "completed")).toBe(true);
    const item = await repo.getById("1");
    expect(item?.status).toBe("completed");
  });

  it("updateStatus는 없는 항목에 false를 반환한다", async () => {
    expect(await repo.updateStatus("nonexistent", "completed")).toBe(false);
  });
});

describe("MockStorageRepository", () => {
  const repo = new MockStorageRepository();

  it("upload는 경로를 반환한다", async () => {
    const url = await repo.upload("images", "test.webp", new Blob());
    expect(url).toContain("test.webp");
  });

  it("delete는 true를 반환한다", async () => {
    expect(await repo.delete("images", "test.webp")).toBe(true);
  });

  it("getPublicUrl은 경로를 반환한다", () => {
    expect(repo.getPublicUrl("images", "test.webp")).toContain("test.webp");
  });
});
