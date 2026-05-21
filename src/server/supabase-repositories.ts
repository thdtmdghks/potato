import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Project } from "@/shared/types";
import type { ProjectRepository, StorageRepository } from "./repositories";

export class SupabaseProjectRepository implements ProjectRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async getAll(category?: string): Promise<Project[]> {
    let query = this.db.from("projects").select("*").order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    return data ?? [];
  }

  async getById(id: string): Promise<Project | null> {
    const { data } = await this.db.from("projects").select("*").eq("id", id).single();
    return data;
  }

  async getCategories(): Promise<string[]> {
    const { data } = await this.db.from("projects").select("category");
    const rows = data as { category: string }[] | null;
    return [...new Set(rows?.map((d) => d.category) ?? [])];
  }

  async create(data: Omit<Project, "id" | "created_at">): Promise<Project | null> {
    const { data: row } = await this.db
      .from("projects")
      .insert(data as never)
      .select()
      .single();
    return row;
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const { data: row } = await this.db
      .from("projects")
      .update(data as never)
      .eq("id", id)
      .select()
      .single();
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.db.from("projects").delete().eq("id", id);
    return !error;
  }
}

export class SupabaseStorageRepository implements StorageRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async upload(bucket: string, path: string, file: File | Blob): Promise<string | null> {
    const { error } = await this.db.storage.from(bucket).upload(path, file);
    return error ? null : this.getPublicUrl(bucket, path);
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    const { error } = await this.db.storage.from(bucket).remove([path]);
    return !error;
  }

  getPublicUrl(bucket: string, path: string): string {
    return this.db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
