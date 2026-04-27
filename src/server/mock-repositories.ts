import type { Project, Product, Inquiry } from '@/shared/types';
import type {
  ProjectRepository,
  ProductRepository,
  InquiryRepository,
  StorageRepository,
} from './repositories';

// --- Mock 데이터 ---
// 엣지 케이스: 이미지 0/1/2/4/8/15개, 빈 features, 긴 텍스트, null email 등

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const mockProjects: Project[] = [
  { id: '1', title: '웹사이트 리뉴얼', description: '기업 홈페이지 전면 리뉴얼. 반응형 디자인과 접근성을 고려한 모던 UI로 전환했습니다.', category: '웹', images: [], created_at: '2025-01-15T00:00:00Z' },
  { id: '2', title: '모바일 앱 개발', description: '크로스플랫폼 앱 개발', category: '앱', images: [IMG('p2a')], created_at: '2025-02-20T00:00:00Z' },
  { id: '3', title: '브랜드 디자인', description: 'CI/BI 디자인 작업', category: '디자인', images: [IMG('p3a'), IMG('p3b')], created_at: '2025-03-10T00:00:00Z' },
  { id: '4', title: '쇼핑몰 구축', description: '결제 시스템 연동, 상품 관리, 주문 추적 기능을 포함한 풀스택 이커머스 플랫폼을 구축했습니다.', category: '웹', images: [IMG('p4a'), IMG('p4b'), IMG('p4c'), IMG('p4d')], created_at: '2025-04-05T00:00:00Z' },
  { id: '5', title: '실시간 대시보드', description: '데이터 시각화 대시보드', category: '앱', images: Array.from({ length: 8 }, (_, i) => IMG(`p5${String.fromCharCode(97 + i)}`)), created_at: '2025-05-12T00:00:00Z' },
  { id: '6', title: '패키지 디자인 시스템 — 대규모 프로젝트에서 일관된 디자인 언어를 유지하기 위한 컴포넌트 라이브러리', description: '디자인 토큰, 컴포넌트 라이브러리, 문서화를 포함한 종합 디자인 시스템. Figma 연동과 Storybook 기반 개발 환경을 구축하여 디자이너-개발자 협업 효율을 극대화했습니다. 총 120개 이상의 컴포넌트와 40개의 페이지 템플릿을 제공합니다.', category: '디자인', images: Array.from({ length: 15 }, (_, i) => IMG(`p6${i}`, 800, 600)), created_at: '2025-06-20T00:00:00Z' },
];

const mockProducts: Product[] = [
  { id: '1', name: '스타터', description: '소규모 비즈니스를 위한 원페이지 솔루션', category: '웹', image: '', features: [], created_at: '2025-01-01T00:00:00Z' },
  { id: '2', name: '비즈니스', description: '성장하는 기업을 위한 표준 패키지', category: '웹', image: IMG('prod2', 600, 400), features: ['반응형 디자인', '5페이지'], created_at: '2025-01-02T00:00:00Z' },
  { id: '3', name: '프리미엄', description: '중견기업을 위한 올인원 솔루션. 관리자 페이지와 SEO 최적화를 포함합니다.', category: '웹', image: IMG('prod3', 600, 400), features: ['반응형 디자인', '10페이지 이상', '관리자 페이지', 'SEO 최적화', '성능 모니터링'], created_at: '2025-01-03T00:00:00Z' },
  { id: '4', name: '엔터프라이즈', description: '대규모 조직을 위한 맞춤형 솔루션. 전담 PM 배정과 SLA를 보장합니다.', category: '앱', image: IMG('prod4', 600, 400), features: ['맞춤 설계', '무제한 페이지', '관리자 페이지', 'SEO 최적화', '성능 모니터링', 'CI/CD 파이프라인', '24/7 모니터링', 'SLA 99.9%', '전담 PM', '보안 감사'], created_at: '2025-01-04T00:00:00Z' },
];

const mockInquiries: Inquiry[] = [
  { id: '1', name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com', type: '웹사이트', address: '서울시 강남구', content: '홈페이지 제작 문의', status: 'pending', created_at: '2025-03-01T00:00:00Z' },
  { id: '2', name: '김영희', phone: '010-9876-5432', email: 'kim@company.co.kr', type: '앱', address: '부산시 해운대구', content: '사내 업무용 모바일 앱 개발을 검토 중입니다. iOS/Android 동시 지원이 필요하며, 기존 ERP 시스템과 연동해야 합니다.', status: 'confirmed', created_at: '2025-03-15T00:00:00Z' },
  { id: '3', name: '이철수', phone: '010-5555-1234', email: null, type: '디자인', address: '대전시 유성구', content: '저희 회사는 올해 창립 10주년을 맞아 브랜드 리뉴얼을 계획하고 있습니다. 기존 CI/BI를 현대적으로 재해석하면서도 기존 고객이 느끼는 브랜드 정체성은 유지하고 싶습니다. 로고, 명함, 봉투, 브로슈어, 웹사이트 디자인까지 통합적인 브랜드 가이드라인 제작을 원합니다. 예산과 일정은 협의 가능하며, 포트폴리오를 보고 연락드립니다.', status: 'completed', created_at: '2025-02-10T00:00:00Z' },
  { id: '4', name: '박지민', phone: '010-7777-8888', email: null, type: '기타', address: '제주시 연동', content: '견적 문의', status: 'pending', created_at: '2025-04-01T00:00:00Z' },
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
