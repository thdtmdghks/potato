import type { Project } from "@/shared/types";

export interface ProjectRepository {
  getAll(category?: string): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(data: Omit<Project, "id" | "created_at">): Promise<Project | null>;
  update(id: string, data: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

export interface StorageRepository {
  upload(bucket: string, path: string, file: File | Blob): Promise<string | null>;
  delete(bucket: string, path: string): Promise<boolean>;
  getPublicUrl(bucket: string, path: string): string;
}

export interface Repositories {
  projects: ProjectRepository;
  storage: StorageRepository;
}
