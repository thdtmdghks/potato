import type { Review } from "@/shared/types";
import type { ReviewRepository } from "../repositories";
import { REVIEW_STATUS } from "@/shared/constants";

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** 개발자 카카오 ID — "내 후기" 페이지 확인용 */
const DEV_KAKAO_ID =
  (process.env.ADMIN_KAKAO_IDS ?? "").split(",")[0]?.split(":")[0]?.trim() || "mock_kakao_dev";

const LONG_CONTENT =
  "경산창호에서 하이샤시 시공을 받았습니다. 처음에는 견적만 받아볼 생각이었는데, 사장님께서 현장에 직접 오셔서 창호 상태를 꼼꼼하게 확인해 주시더라고요. 기존 샤시가 20년 된 알루미늄이라 틈새바람이 심하고 결로도 매년 생겼었습니다. 상담 때 PVC 이중창과 시스템 창호의 차이점, 유리 두께별 단열 성능을 자세하게 설명해 주셔서 선택하기 수월했습니다. 시공 당일에는 기존 창호 철거부터 새 프레임 설치, 코킹 마감까지 하루 만에 깔끔하게 끝내주셨어요. 특히 인상적이었던 건 시공 후 바닥과 창틀 주변을 완벽하게 청소해 주신 것입니다. 다른 업체는 쓰레기만 치우고 가시는 경우가 많은데, 여기는 먼지 하나 없이 정리해 주셨습니다. 시공 후 첫 겨울을 지내봤는데 결로가 완전히 사라졌고, 난방비도 전년 대비 30% 이상 줄었습니다. 외부 소음 차단도 체감이 확실해서 도로변인데도 조용합니다. 가격 대비 성능이 정말 뛰어나다고 느꼈고, 주변 이웃분들에게도 추천해서 3세대가 추가로 시공을 받으셨습니다. 다음에 방충망이나 방범창도 여기서 할 예정입니다. 정말 만족스러운 시공이었습니다. 감사합니다!";

export class MockReviewRepository implements ReviewRepository {
  private reviewsData: Review[] = [
    // 1) rating 5, approved, 이미지 0장, 최대 경계 content (~1000자)
    {
      id: "018fc723-b780-7000-8000-000000000001",
      kakao_id: "mock_kakao_1",
      author_name: "홍길동",
      author_avatar: "https://picsum.photos/seed/avatar1/100/100",
      content: LONG_CONTENT,
      images: [],
      status: REVIEW_STATUS.APPROVED,
      primary_image: null,
      rating: 5,
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
    // 2) rating 4, approved, 이미지 1장, 적당한 content (~100자)
    {
      id: "018fc723-b780-7000-8000-000000000002",
      kakao_id: "mock_kakao_2",
      author_name: "이순신",
      author_avatar: "https://picsum.photos/seed/avatar2/100/100",
      content:
        "방충망 교체를 맡겼는데 미세먼지 차단망으로 업그레이드해 주셨어요. 시공도 빠르고 마감도 깔끔합니다. 가격도 합리적이라 만족합니다.",
      images: [IMG("mesh1")],
      status: REVIEW_STATUS.APPROVED,
      primary_image: IMG("mesh1"),
      rating: 4,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    // 3) rating 3, approved, 이미지 3장, 짧은 content (~20자), 아바타 없음
    {
      id: "018fc723-b780-7000-8000-000000000003",
      kakao_id: "mock_kakao_3",
      author_name: "임꺽정",
      author_avatar: "",
      content: "보통이에요. 마감이 아쉬웠습니다.",
      images: [IMG("rev3a"), IMG("rev3b"), IMG("rev3c")],
      status: REVIEW_STATUS.APPROVED,
      primary_image: IMG("rev3a"),
      rating: 3,
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    // 4) rating 2, approved, 이미지 5장, 긴 content (~300자)
    {
      id: "018fc723-b780-7000-8000-000000000004",
      kakao_id: DEV_KAKAO_ID,
      author_name: "장보고",
      author_avatar: "https://picsum.photos/seed/avatar4/100/100",
      content:
        "유리 교체 시공을 받았는데 솔직히 기대에 못 미쳤습니다. 복층유리로 교체하면 결로가 완전히 사라진다고 하셨는데, 북쪽 창은 여전히 약간 생깁니다. 시공 자체는 깔끔했고 사장님 친절하셨지만, 사전에 100% 해결된다는 말씀에 기대가 컸던 만큼 아쉬움이 남습니다. 다만 이전보다는 확실히 개선됐고, 단열 효과는 체감됩니다. 가격은 적정 수준이었습니다.",
      images: [IMG("rev4a"), IMG("rev4b"), IMG("rev4c"), IMG("rev4d"), IMG("rev4e")],
      status: REVIEW_STATUS.APPROVED,
      primary_image: IMG("rev4a"),
      rating: 2,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    // 5) rating 1, pending, 이미지 2장, 최소 경계 content (5자)
    {
      id: "018fc723-b780-7000-8000-000000000005",
      kakao_id: "mock_kakao_5",
      author_name: "유관순",
      author_avatar: "https://picsum.photos/seed/avatar5/100/100",
      content: "별로예요.",
      images: [IMG("rev5a"), IMG("rev5b")],
      status: REVIEW_STATUS.PENDING,
      primary_image: IMG("rev5a"),
      rating: 1,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    // 6) rating 5, pending, 이미지 0장, 보통 content (~80자), 아바타 없음
    {
      id: "018fc723-b780-7000-8000-000000000006",
      kakao_id: "mock_kakao_6",
      author_name: "신사임당",
      author_avatar: "",
      content:
        "ABS 도어 시공 받았습니다. 화장실 3개소 모두 교체했는데 방수도 잘 되고 디자인도 예쁘네요. 추천합니다!",
      images: [],
      status: REVIEW_STATUS.PENDING,
      primary_image: null,
      rating: 5,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    // 7) rating 4, approved, 이미지 1장 — kakao_id를 #2와 동일 (내 후기 복수)
    {
      id: "018fc723-b780-7000-8000-000000000007",
      kakao_id: "mock_kakao_2",
      author_name: "이순신",
      author_avatar: "https://picsum.photos/seed/avatar2/100/100",
      content:
        "두 번째로 방범창 시공도 맡겼습니다. 이번에도 역시 깔끔하고 튼튼하게 잘 해주셨어요. 단골 됩니다!",
      images: [IMG("rev7a")],
      status: REVIEW_STATUS.APPROVED,
      primary_image: IMG("rev7a"),
      rating: 4,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    // 8) rating 5, approved, 이미지 2장 — updated_at ≠ created_at (수정 이력 있음)
    {
      id: "018fc723-b780-7000-8000-000000000008",
      kakao_id: "mock_kakao_7",
      author_name: "세종대왕",
      author_avatar: "https://picsum.photos/seed/avatar7/100/100",
      content: "잡철 시공 깔끔합니다. 난간 용접 부위 마감이 특히 좋았어요.",
      images: [IMG("rev8a"), IMG("rev8b")],
      status: REVIEW_STATUS.APPROVED,
      primary_image: IMG("rev8a"),
      rating: 5,
      created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    // 9) rating 3, pending, 이미지 5장, 긴 content (~300자) — 이미지 많은 pending
    {
      id: "018fc723-b780-7000-8000-000000000009",
      kakao_id: DEV_KAKAO_ID,
      author_name: "장보고",
      author_avatar: "https://picsum.photos/seed/avatar4/100/100",
      content:
        "복층유리 시공을 받았습니다. 시공 과정에서 기존 창틀 하부에 부식이 발견되어 보강 작업이 추가됐는데, 추가 비용 없이 처리해 주셔서 감사했습니다. 유리 두께가 이전보다 두꺼워져서 확실히 소음이 줄었고, 결로도 많이 개선됐습니다. 다만 시공 당일 일정이 한 시간 정도 지연됐는데 사전 연락이 있었으면 더 좋았을 것 같습니다. 전반적으로는 만족합니다.",
      images: [IMG("rev9a"), IMG("rev9b"), IMG("rev9c"), IMG("rev9d"), IMG("rev9e")],
      status: REVIEW_STATUS.PENDING,
      primary_image: IMG("rev9a"),
      rating: 3,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    // 10) rating 4, pending, 이미지 1장, 최대 경계 content (~1000자), 아바타 없음
    {
      id: "018fc723-b780-7000-8000-000000000010",
      kakao_id: "mock_kakao_9",
      author_name: "정약용",
      author_avatar: "",
      content:
        "하이샤시 시공 후기입니다. 저희 집은 30년 된 아파트라 창호가 모두 낡아서 겨울마다 외풍에 고생했습니다. 인터넷으로 여러 업체 견적을 받아봤는데, 경산창호가 가격 대비 스펙이 가장 좋았습니다. 사장님이 직접 방문해서 현장을 확인하시고, 저희 집 구조에 맞는 최적의 창호 조합을 제안해 주셨어요. 거실과 안방은 시스템 창호, 작은 방들은 PVC 이중창으로 차등 적용하는 방식이었는데, 예산 내에서 최대 효과를 뽑을 수 있는 합리적인 제안이었습니다. 시공은 이틀에 걸쳐 진행됐고, 첫째 날 철거와 프레임 설치, 둘째 날 유리 끼우기와 코킹 마감으로 깔끔하게 마무리됐습니다. 시공 중 먼지가 많이 나는 작업이라 걱정했는데, 비닐 보양을 철저히 해주셔서 가구나 바닥에 피해가 전혀 없었습니다. 시공 후 첫 겨울을 지내봤는데, 체감 온도가 확 달라졌습니다. 보일러 가동 시간이 절반으로 줄었고 가스비도 작년 대비 40% 가까이 절감됐습니다. 특히 새벽에 창가 근처가 춥지 않아서 수면의 질도 좋아졌어요. 소음 차단도 뛰어나서 바로 앞 도로의 차 소리가 거의 안 들립니다. 시공 후 한 달쯤 됐을 때 코킹 부위 하나가 살짝 벌어진 걸 발견해서 연락드렸더니, 다음 날 바로 오셔서 무상 보수해 주셨습니다. A/S 대응도 빠르고 확실합니다.",
      images: [IMG("rev10a")],
      status: REVIEW_STATUS.PENDING,
      primary_image: IMG("rev10a"),
      rating: 4,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  async getById(id: string): Promise<Review | null> {
    return this.reviewsData.find((r) => r.id === id) ?? null;
  }

  async getByKakaoId(kakaoId: string): Promise<Review[]> {
    return this.reviewsData.filter((r) => r.kakao_id === kakaoId);
  }

  async getAllApproved(): Promise<Review[]> {
    return this.reviewsData
      .filter((r) => r.status === REVIEW_STATUS.APPROVED)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async getAllPending(): Promise<Review[]> {
    return this.reviewsData
      .filter((r) => r.status === REVIEW_STATUS.PENDING)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async create(data: Omit<Review, "created_at" | "status" | "updated_at">): Promise<Review | null> {
    const item: Review = {
      ...data,
      status: REVIEW_STATUS.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.reviewsData.push(item);
    return item;
  }

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    const idx = this.reviewsData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.reviewsData[idx] = {
      ...this.reviewsData[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.reviewsData[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.reviewsData.length;
    this.reviewsData = this.reviewsData.filter((r) => r.id !== id);
    return this.reviewsData.length < len;
  }
}
