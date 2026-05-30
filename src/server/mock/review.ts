import type { Review } from "@/shared/types";
import type { ReviewRepository } from "../repositories";
import { REVIEW_STATUS } from "@/shared/constants";

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export class MockReviewRepository implements ReviewRepository {
  private reviewsData: Review[] = [
    {
      id: "018fc723-b780-7000-8000-000000000001",
      kakao_id: "mock_kakao_1",
      author_name: "홍길동",
      author_avatar: "https://picsum.photos/seed/avatar1/100/100",
      content:
        "경산창호 하이샤시 시공 정말 마음에 듭니다! 단열이 아주 잘 돼요. 원래 겨울만 되면 창가에서 찬 바람이 쌩쌩 불어서 보일러를 아무리 틀어도 추웠는데, 샤시 교체하고 나서는 온 집안이 훈훈합니다. 소음 차단도 확실해서 밖에서 차 지나다니는 소리가 하나도 안 들려요. 꼼꼼하게 시공해 주신 사장님 정말 감사드리고 주변에도 적극 추천하겠습니다!",
      images: [IMG("pvc1"), IMG("pvc1b")],
      status: REVIEW_STATUS.APPROVED,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "018fc723-b780-7000-8000-000000000002",
      kakao_id: "mock_kakao_2",
      author_name: "이순신",
      author_avatar: "",
      content: "방충망 교체 깔끔하게 해주셨네요. 친절하십니다.",
      images: [IMG("mesh1")],
      status: REVIEW_STATUS.PENDING,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "018fc723-b780-7000-8000-000000000003",
      kakao_id: "mock_kakao_3",
      author_name: "임꺽정",
      author_avatar: "https://picsum.photos/seed/avatar3/100/100",
      content: "샤시 시공하고 1년 지났는데, 튼튼하고 아주 좋습니다. 추천합니다.",
      images: [IMG("pvc2")],
      status: REVIEW_STATUS.APPROVED,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
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
