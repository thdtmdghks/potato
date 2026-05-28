import type { Repositories } from "../repositories";
import { MockProjectRepository } from "./project";
import { MockStorageRepository } from "./storage";
import { MockReviewRepository } from "./review";
import { MockReviewEditRepository } from "./review-edit";

export * from "./project";
export * from "./storage";
export * from "./review";
export * from "./review-edit";

export function createMockRepositories(): Repositories {
  const reviews = new MockReviewRepository();
  return {
    projects: new MockProjectRepository(),
    storage: new MockStorageRepository(),
    reviews,
    reviewEdits: new MockReviewEditRepository(reviews),
  };
}
