import type { Project, Product, Inquiry } from './types';
import type {
  ProjectRepository,
  ProductRepository,
  InquiryRepository,
  StorageRepository,
} from './repositories';

// --- Mock 데이터 ---

const mockProjects: Project[] = [
  { id: '1', title: '웹사이트 리뉴얼', description: '기업 홈페이지 리뉴얼 프로젝트', category: '웹', images: ['/mock/project1.webp'], created_at: '2025-01-15T00:00:00Z' },
  { id: '2', title: '모바일 앱 개발', description: '크로스플랫폼 앱 개발', category: '앱', images: ['/mock/project2.webp'], created_at: '2025-02-20T00:00:00Z' },
  { id: '3', title: '브랜드 디자인', description: 'CI/BI 디자인 작업', category: '디자인', images: ['/mock/project3.webp'], created_at: '2025-03-10T00:00:00Z' },
];

const mockProducts: Product[] = [
  { id: '1', name: '기본 패키지', description: '소규모 비즈니스용', category: '웹', image: '/mock/product1.webp', features: ['반응형', '5페이지'], created_at: '2025-01-01T00:00:00Z' },
  { id: '2', name: '프리미엄 패키지', description: '중소기업용', category: '웹', image: '/mock/product2.webp', features: ['반응형', '10페이지', '관리자'], created_at: '2025-01-02T00:00:00Z' },
];

const mockInquiries: Inquiry[] = [
  { id: '1', name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com', type: '웹사이트', address: '서울시 강남구', content: '홈페이지 제작 문의', status: 'pending', created_at: '2025-03-01T00:00:00Z' },
];

// --- Mock Repository 구현체 ---

export class MockProjectRepository implements ProjectRepository {
  private data = [...mockProjects];

  async getAll(category?: string) {
    return category ? this.data.filter((p) => p.category === category) : this.data;
  }
  async getById(id: string) { return this.data.find((p) => p.id === id) ?? null; }
  async getCategories() { return [...new Set(this.data.map((p) => p.category))]; }
  async create(data: Omit<Project, 'id' | 'created_at'>) {
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
  async getById(id: string) { return this.data.find((p) => p.id === id) ?? null; }
  async getCategories() { return [...new Set(this.data.map((p) => p.category))]; }
  async create(data: Omit<Product, 'id' | 'created_at'>) {
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
  async getById(id: string) { return this.data.find((i) => i.id === id) ?? null; }
  async create(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>) {
    const item = { ...data, id: crypto.randomUUID(), status: 'pending', created_at: new Date().toISOString() };
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
  async upload(_bucket: string, path: string) { return `/mock/${path}`; }
  async delete() { return true; }
  getPublicUrl(_bucket: string, path: string) { return `/mock/${path}`; }
}

export function getMockRepositories() {
  return {
    projects: new MockProjectRepository(),
    products: new MockProductRepository(),
    inquiries: new MockInquiryRepository(),
    storage: new MockStorageRepository(),
  };
}
