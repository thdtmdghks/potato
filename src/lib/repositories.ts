import type { Project, Product, Inquiry } from "./types";

export interface ProjectRepository {
  getAll(category?: string): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  getCategories(): Promise<string[]>;
  create(data: Omit<Project, "id" | "created_at">): Promise<Project | null>;
  update(id: string, data: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

export interface ProductRepository {
  getAll(category?: string): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getCategories(): Promise<string[]>;
  create(data: Omit<Product, "id" | "created_at">): Promise<Product | null>;
  update(id: string, data: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export interface InquiryRepository {
  getAll(status?: string): Promise<Inquiry[]>;
  getById(id: string): Promise<Inquiry | null>;
  create(data: Omit<Inquiry, "id" | "created_at" | "status">): Promise<Inquiry | null>;
  updateStatus(id: string, status: string): Promise<boolean>;
}

export interface StorageRepository {
  upload(bucket: string, path: string, file: File | Blob): Promise<string | null>;
  delete(bucket: string, path: string): Promise<boolean>;
  getPublicUrl(bucket: string, path: string): string;
}
