import type { Project } from "@/shared/types";
import type { ProjectRepository, StorageRepository, Repositories } from "./repositories";

// --- Mock 데이터 ---
// 경산창호 시공사례 데이터

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const mockProjects: Project[] = [
  {
    id: "1",
    title: "PVC 이중창 시공",
    description: "아파트 거실 PVC 이중창 교체 시공. 단열 성능 대폭 개선.",
    category: "하이샤시",
    images: [IMG("pvc1"), IMG("pvc1b")],
    created_by: "4904776698",
    created_at: "2025-03-15T00:00:00Z",
  },
  {
    id: "2",
    title: "알루미늄 샤시 교체",
    description: "상가 전면 알루미늄 샤시 교체. 내구성과 디자인 모두 만족.",
    category: "하이샤시",
    images: [IMG("alu1"), IMG("alu1b")],
    created_by: "4904776698",
    created_at: "2025-03-10T00:00:00Z",
  },
  {
    id: "3",
    title: "방충망 전체 교체",
    description: "빌라 전 세대 방충망 교체 시공. 미세망으로 업그레이드.",
    category: "방충망",
    images: [IMG("mesh1")],
    created_by: "4904776698",
    created_at: "2025-02-20T00:00:00Z",
  },
  {
    id: "4",
    title: "복층유리 교체",
    description: "결로 문제 해결을 위한 복층유리 교체. 단열 효과 확인.",
    category: "유리",
    images: [IMG("glass1"), IMG("glass1b"), IMG("glass1c")],
    created_by: "4904776698",
    created_at: "2025-02-15T00:00:00Z",
  },
  {
    id: "5",
    title: "ABS 도어 설치",
    description: "화장실 ABS 도어 3개소 설치. 방수 성능 우수.",
    category: "ABS도어",
    images: [IMG("door1")],
    created_by: "4904776698",
    created_at: "2025-01-25T00:00:00Z",
  },
  {
    id: "6",
    title: "방범창 시공",
    description: "1층 세대 방범창 설치. 안전하고 깔끔한 마감.",
    category: "방범창",
    images: [IMG("sec1"), IMG("sec1b")],
    created_by: "4904776698",
    created_at: "2025-01-10T00:00:00Z",
  },
];

// --- Mock Repository 구현체 ---

export class MockProjectRepository implements ProjectRepository {
  private data = [...mockProjects];

  async getAll(category?: string) {
    return category ? this.data.filter((p) => p.category === category) : this.data;
  }
  async getById(id: string) {
    return this.data.find((p) => p.id === id) ?? null;
  }
  async getCategories() {
    return [...new Set(this.data.map((p) => p.category))];
  }
  async create(data: Omit<Project, "id" | "created_at">) {
    const item = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    this.data.unshift(item);
    return item;
  }
  async update(id: string, data: Partial<Project>) {
    const idx = this.data.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...data };
    return this.data[idx];
  }
  async delete(id: string) {
    const len = this.data.length;
    this.data = this.data.filter((p) => p.id !== id);
    return this.data.length < len;
  }
}

export class MockStorageRepository implements StorageRepository {
  async upload(_bucket: string, path: string) {
    return `/mock/${path}`;
  }
  async delete() {
    return true;
  }
  getPublicUrl(_bucket: string, path: string) {
    return `/mock/${path}`;
  }
}

export function createMockRepositories(): Repositories {
  return {
    projects: new MockProjectRepository(),
    storage: new MockStorageRepository(),
  };
}
