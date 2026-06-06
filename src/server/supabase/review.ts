import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Review } from "@/shared/types";
import type { ReviewRepository } from "../repositories";
import { REVIEW_STATUS } from "@/shared/constants";

export class SupabaseReviewRepository implements ReviewRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async getById(id: string): Promise<Review | null> {
    const { data, error } = await this.db.from("reviews").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  async getByKakaoId(kakaoId: string): Promise<Review[]> {
    const { data, error } = await this.db
      .from("reviews")
      .select("*")
      .eq("kakao_id", kakaoId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getAllApproved(): Promise<Review[]> {
    const { data, error } = await this.db
      .from("reviews")
      .select("*")
      .eq("status", REVIEW_STATUS.APPROVED)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getAllPending(): Promise<Review[]> {
    const { data, error } = await this.db
      .from("reviews")
      .select("*")
      .eq("status", REVIEW_STATUS.PENDING)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async create(data: Omit<Review, "created_at" | "status" | "updated_at">): Promise<Review | null> {
    const { data: row, error } = await this.db
      .from("reviews")
      .insert({ ...data, status: REVIEW_STATUS.PENDING })
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    const { data: row, error } = await this.db
      .from("reviews")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.db.from("reviews").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
