import type { Project, Review, ReviewEdit } from "@/shared/types";

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

export interface ReviewRepository {
  getById(id: string): Promise<Review | null>;
  getByKakaoId(kakaoId: string): Promise<Review[]>;
  getAllApproved(): Promise<Review[]>;
  getAllPending(): Promise<Review[]>;
  create(data: Omit<Review, "created_at" | "status" | "updated_at">): Promise<Review | null>;
  update(id: string, data: Partial<Review>): Promise<Review | null>;
  delete(id: string): Promise<boolean>;
}

export interface ReviewEditRepository {
  getById(reviewId: string): Promise<ReviewEdit | null>;
  getAll(): Promise<ReviewEdit[]>;
  getAllWithOriginal(): Promise<(ReviewEdit & { original: Review })[]>;
  upsert(data: Omit<ReviewEdit, "created_at">): Promise<ReviewEdit | null>;
  delete(reviewId: string): Promise<boolean>;
}

export interface Repositories {
  projects: ProjectRepository;
  storage: StorageRepository;
  reviews: ReviewRepository;
  reviewEdits: ReviewEditRepository;
}
