import type { Project, Product, Inquiry } from "@/shared/types";
import type {
  ProjectRepository,
  ProductRepository,
  InquiryRepository,
  StorageRepository,
} from "./repositories";

// --- Mock 데이터 ---
// 경산창호 시공사례 및 서비스 데이터

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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "하이샤시",
    description: "단열·방음 효과가 뛰어난 PVC 이중창",
    category: "샤시",
    image: IMG("prod-pvc", 600, 400),
    features: ["우수한 단열 성능", "방음 효과", "결로 방지", "다양한 색상"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "알루미늄 샤시",
    description: "내구성 좋은 알루미늄 창호",
    category: "샤시",
    image: IMG("prod-alu", 600, 400),
    features: ["높은 내구성", "슬림한 프레임", "대형 창호 가능", "다양한 개폐 방식"],
    created_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "방충망",
    description: "미세망·롤방충망 등 다양한 방충망",
    category: "기타",
    image: IMG("prod-mesh", 600, 400),
    features: ["미세먼지 차단", "롤타입 가능", "쉬운 탈착", "내구성 우수"],
    created_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "유리",
    description: "복층유리·강화유리·접합유리 교체",
    category: "유리",
    image: IMG("prod-glass", 600, 400),
    features: ["복층유리 단열", "강화유리 안전", "접합유리 방범", "당일 시공"],
    created_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "ABS 도어",
    description: "욕실·화장실 전용 ABS 도어",
    category: "도어",
    image: IMG("prod-door", 600, 400),
    features: ["방수 성능", "다양한 디자인", "쉬운 관리", "합리적 가격"],
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "6",
    name: "방범창",
    description: "안전한 주거환경을 위한 방범창",
    category: "기타",
    image: IMG("prod-sec", 600, 400),
    features: ["강력한 방범", "깔끔한 디자인", "환기 가능", "맞춤 제작"],
    created_at: "2025-01-06T00:00:00Z",
  },
];

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    name: "김철수",
    phone: "010-1234-5678",
    email: null,
    type: "하이샤시",
    address: "경산시 중방동",
    content: "거실 창문 PVC 이중창으로 교체 견적 부탁드립니다.",
    status: "pending",
    created_at: "2025-04-01T00:00:00Z",
  },
  {
    id: "2",
    name: "박영희",
    phone: "010-9876-5432",
    email: null,
    type: "방충망",
    address: "대구시 수성구",
    content: "아파트 방충망 전체 교체 문의합니다. 미세망으로 해주세요.",
    status: "confirmed",
    created_at: "2025-03-20T00:00:00Z",
  },
  {
    id: "3",
    name: "이민수",
    phone: "010-5555-1234",
    email: null,
    type: "유리",
    address: "경산시 압량면",
    content: "결로가 심해서 복층유리로 교체하고 싶습니다.",
    status: "completed",
    created_at: "2025-03-10T00:00:00Z",
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

export class MockProductRepository implements ProductRepository {
  private data = [...mockProducts];

  async getAll(category?: string) {
    return category ? this.data.filter((p) => p.category === category) : this.data;
  }
  async getById(id: string) {
    return this.data.find((p) => p.id === id) ?? null;
  }
  async getCategories() {
    return [...new Set(this.data.map((p) => p.category))];
  }
  async create(data: Omit<Product, "id" | "created_at">) {
    const item = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    this.data.unshift(item);
    return item;
  }
  async update(id: string, data: Partial<Product>) {
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

export class MockInquiryRepository implements InquiryRepository {
  private data = [...mockInquiries];

  async getAll(status?: string) {
    return status ? this.data.filter((i) => i.status === status) : this.data;
  }
  async getById(id: string) {
    return this.data.find((i) => i.id === id) ?? null;
  }
  async create(data: Omit<Inquiry, "id" | "created_at" | "status">) {
    const item = {
      ...data,
      id: crypto.randomUUID(),
      status: "pending",
      created_at: new Date().toISOString(),
    };
    this.data.unshift(item);
    return item;
  }
  async updateStatus(id: string, status: string) {
    const item = this.data.find((i) => i.id === id);
    if (!item) return false;
    item.status = status;
    return true;
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

export function getMockRepositories() {
  return {
    projects: new MockProjectRepository(),
    products: new MockProductRepository(),
    inquiries: new MockInquiryRepository(),
    storage: new MockStorageRepository(),
  };
}
