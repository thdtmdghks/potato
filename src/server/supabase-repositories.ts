import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Project } from "@/shared/types";
import type { ProjectRepository, StorageRepository } from "./repositories";
import { logError } from "./logger";

export class SupabaseProjectRepository implements ProjectRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async getAll(category?: string): Promise<Project[]> {
    let query = this.db.from("projects").select("*").order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) {
      logError("SupabaseProjectRepository.getAll", error, { category });
      return [];
    }
    return data ?? [];
  }

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await this.db.from("projects").select("*").eq("id", id).single();
    if (error) {
      logError("SupabaseProjectRepository.getById", error, { id });
      return null;
    }
    return data;
  }

  async create(data: Omit<Project, "id" | "created_at">): Promise<Project | null> {
    const { data: row, error } = await this.db.from("projects").insert(data).select().single();
    if (error) {
      logError("SupabaseProjectRepository.create", error, data);
      return null;
    }
    return row;
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const { data: row, error } = await this.db
      .from("projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      logError("SupabaseProjectRepository.update", error, { id, data });
      return null;
    }
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.db.from("projects").delete().eq("id", id);
    if (error) {
      logError("SupabaseProjectRepository.delete", error, { id });
      return false;
    }
    return true;
  }
}

export class SupabaseStorageRepository implements StorageRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async upload(bucket: string, path: string, file: File | Blob): Promise<string | null> {
    const { error } = await this.db.storage.from(bucket).upload(path, file);
    if (error) {
      logError("SupabaseStorageRepository.upload", error, { bucket, path });
      return null;
    }
    return this.getPublicUrl(bucket, path);
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    const { error } = await this.db.storage.from(bucket).remove([path]);
    if (error) {
      logError("SupabaseStorageRepository.delete", error, { bucket, path });
      return false;
    }
    return true;
  }

  getPublicUrl(bucket: string, path: string): string {
    return this.db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
