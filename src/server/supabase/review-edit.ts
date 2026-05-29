import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Review, ReviewEdit } from "@/shared/types";
import type { ReviewEditRepository } from "../repositories";
import { logError } from "../logger";

export class SupabaseReviewEditRepository implements ReviewEditRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async getById(reviewId: string): Promise<ReviewEdit | null> {
    const { data, error } = await this.db
      .from("review_edits")
      .select("*")
      .eq("review_id", reviewId)
      .single();
    if (error) {
      if (error.code !== "PGRST116") {
        logError("SupabaseReviewEditRepository.getById", error, { reviewId });
      }
      return null;
    }
    return data;
  }

  async getAll(): Promise<ReviewEdit[]> {
    const { data, error } = await this.db
      .from("review_edits")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      logError("SupabaseReviewEditRepository.getAll", error);
      return [];
    }
    return data ?? [];
  }

  async getAllWithOriginal(): Promise<(ReviewEdit & { original: Review })[]> {
    const { data, error } = await this.db
      .from("review_edits")
      .select("*, reviews(*)")
      .order("created_at", { ascending: false });
    if (error) {
      logError("SupabaseReviewEditRepository.getAllWithOriginal", error);
      return [];
    }

    type RowWithOriginal = Database["public"]["Tables"]["review_edits"]["Row"] & {
      reviews: Database["public"]["Tables"]["reviews"]["Row"] | null;
    };

    return ((data as RowWithOriginal[]) ?? [])
      .filter((row) => row.reviews !== null)
      .map((row) => {
        const { reviews, ...edit } = row;
        return {
          ...edit,
          original: reviews as Review,
        };
      });
  }

  async upsert(data: Omit<ReviewEdit, "created_at">): Promise<ReviewEdit | null> {
    const { data: row, error } = await this.db.from("review_edits").upsert(data).select().single();
    if (error) {
      logError("SupabaseReviewEditRepository.upsert", error, data);
      return null;
    }
    return row;
  }

  async delete(reviewId: string): Promise<boolean> {
    const { error } = await this.db.from("review_edits").delete().eq("review_id", reviewId);
    if (error) {
      logError("SupabaseReviewEditRepository.delete", error, { reviewId });
      return false;
    }
    return true;
  }
}
