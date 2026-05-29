import type { Review } from "@/shared/types";
import type { ReviewRepository } from "../repositories";

const IMG = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export class MockReviewRepository implements ReviewRepository {
  private reviewsData: Review[] = [
    {
      id: "77777777-7777-7777-7777-777777777777",
      kakao_id: "mock_kakao_1",
      author_name: "홍길동",
      author_avatar: "https://picsum.photos/seed/avatar1/100/100",
      content: "경산창호 하이샤시 시공 정말 마음에 듭니다! 단열이 아주 잘 돼요.",
      images: [IMG("pvc1"), IMG("pvc1b")],
      status: "approved",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "88888888-8888-8888-8888-888888888888",
      kakao_id: "mock_kakao_2",
      author_name: "이순신",
      author_avatar: "",
      content: "방충망 교체 깔끔하게 해주셨네요. 친절하십니다.",
      images: [],
      status: "pending",
      created_at: new Date(Date.now() - 86400000).toISOString(),
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
      .filter((r) => r.status === "approved")
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async getAllPending(): Promise<Review[]> {
    return this.reviewsData
      .filter((r) => r.status === "pending")
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async create(data: Omit<Review, "created_at" | "status">): Promise<Review | null> {
    const item: Review = {
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    this.reviewsData.push(item);
    return item;
  }

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    const idx = this.reviewsData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.reviewsData[idx] = { ...this.reviewsData[idx], ...data };
    return this.reviewsData[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.reviewsData.length;
    this.reviewsData = this.reviewsData.filter((r) => r.id !== id);
    return this.reviewsData.length < len;
  }
}
