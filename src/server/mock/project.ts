import type { Project } from "@/shared/types";
import type { ProjectRepository } from "../repositories";

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const mockProjects: Project[] = [
  // 1) 이미지 0장, 짧은 제목/설명 — 이미지 없는 엣지
  {
    id: "1",
    title: "방충망 교체",
    description: "빌라 1층 방충망 교체 완료.",
    category: "방충망",
    images: [],
    primary_image: null,
    created_by: "4904776698",
    created_at: "2025-06-01T00:00:00Z",
  },
  // 2) 이미지 1장, 적당한 설명 (~100자) — 기본 케이스
  {
    id: "2",
    title: "아파트 거실 PVC 이중창 시공",
    description:
      "경산 옥산동 아파트 거실 PVC 이중창 교체 시공입니다. 기존 단창에서 이중창으로 변경하여 단열 성능을 대폭 개선했으며, 외부 소음 차단 효과도 확인됐습니다.",
    category: "하이샤시",
    images: [IMG("pvc1")],
    primary_image: IMG("pvc1"),
    created_by: "4904776698",
    created_at: "2025-05-20T00:00:00Z",
  },
  // 3) 이미지 3장, 긴 설명 (~300자) — 다중 이미지 + 상세 설명
  {
    id: "3",
    title: "상가 전면 알루미늄 샤시 전체 교체 공사",
    description:
      "경산 중방동 상가 1층 전면 알루미늄 샤시 교체 공사입니다. 기존 20년 된 샤시가 뒤틀려 밀폐가 안 되는 상태였습니다. 전면부 6미터 구간을 모두 철거하고 신규 알루미늄 프레임으로 교체했습니다. 5mm 복층유리를 적용하여 단열과 방음을 동시에 해결했고, 하부 물끊기 시공으로 빗물 침투도 완전히 차단했습니다. 공사 기간 이틀, 영업 지장 최소화를 위해 야간 작업으로 진행했습니다.",
    category: "하이샤시",
    images: [IMG("alu1"), IMG("alu2"), IMG("alu3")],
    primary_image: IMG("alu1"),
    created_by: "4904776698",
    created_at: "2025-04-15T00:00:00Z",
  },
  // 4) 이미지 5장, 아주 긴 설명 (~500자) — 이미지 많음 + 긴 텍스트
  {
    id: "4",
    title: "복층유리 + 샤시 일체 교체",
    description:
      "진량읍 단독주택 전체 창호 교체 프로젝트입니다. 1층과 2층 합계 12개 창을 모두 교체했습니다. 기존 창호는 30년 이상 된 목재 프레임으로 틈새바람이 심하고 결로가 매년 발생하는 상태였습니다. 이번 시공에서는 LG하우시스 PVC 시스템 창호에 24mm 로이복층유리를 적용했습니다. 특히 북측 침실은 삼중유리로 업그레이드하여 겨울철 결로를 원천 차단했습니다. 욕실 2개소는 불투명 유리로 시공하여 채광과 프라이버시를 동시에 확보했습니다. 시공 후 열화상 카메라로 단열 성능을 측정한 결과, 외기 온도 대비 실내 유리면 온도차가 기존 12도에서 3도로 개선된 것을 확인했습니다. 공사 기간은 3일 소요되었으며 가구 보양 작업을 포함하여 깔끔하게 마무리했습니다.",
    category: "유리",
    images: [IMG("glass1"), IMG("glass2"), IMG("glass3"), IMG("glass4"), IMG("glass5")],
    primary_image: IMG("glass1"),
    created_by: "4904776698",
    created_at: "2025-03-10T00:00:00Z",
  },
  // 5) 이미지 2장, 최소 제목/설명 (1자) — 최소값 경계
  {
    id: "5",
    title: "문",
    description: "완",
    category: "ABS도어",
    images: [IMG("door1"), IMG("door2")],
    primary_image: IMG("door1"),
    created_by: "4904776698",
    created_at: "2025-02-05T00:00:00Z",
  },
  // 6) 이미지 10장, 적당한 설명 — 이미지 매우 많음, 갤러리 UI 스크롤 테스트
  {
    id: "6",
    title: "방범창 + 방충망 일괄 시공",
    description:
      "빌라 1~3층 전 세대 방범창 및 방충망 일괄 시공입니다. 총 24개소 작업으로 세대별 시공 사진을 첨부합니다. 방범창은 스테인리스 재질, 방충망은 미세먼지 차단 기능망을 적용했습니다.",
    category: "방범창",
    images: [
      IMG("sec1"),
      IMG("sec2"),
      IMG("sec3"),
      IMG("sec4"),
      IMG("sec5"),
      IMG("sec6"),
      IMG("sec7"),
      IMG("sec8"),
      IMG("sec9"),
      IMG("sec10"),
    ],
    primary_image: IMG("sec1"),
    created_by: "4904776698",
    created_at: "2025-01-10T00:00:00Z",
  },
];

export class MockProjectRepository implements ProjectRepository {
  private data = [...mockProjects];

  async getAll(category?: string) {
    return category ? this.data.filter((p) => p.category === category) : this.data;
  }
  async getById(id: string) {
    return this.data.find((p) => p.id === id) ?? null;
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
