import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types";
import type { StorageRepository } from "../repositories";

export class SupabaseStorageRepository implements StorageRepository {
  constructor(private db: SupabaseClient<Database>) {}

  async upload(bucket: string, path: string, file: File | Blob): Promise<string> {
    const { error } = await this.db.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return this.getPublicUrl(bucket, path);
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    const { error } = await this.db.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  }

  getPublicUrl(bucket: string, path: string): string {
    return this.db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
