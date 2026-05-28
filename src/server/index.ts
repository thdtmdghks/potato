import type { Repositories } from "./repositories";

declare global {
  var __mock_repositories: Repositories | undefined;
  var __supabase_repositories: Repositories | undefined;
}

export async function getServerRepositories(): Promise<Repositories> {
  if (!process.env.SUPABASE_URL) {
    if (!globalThis.__mock_repositories) {
      const { createMockRepositories } = await import("./mock");
      globalThis.__mock_repositories = createMockRepositories();
    }
    return globalThis.__mock_repositories;
  }

  if (!globalThis.__supabase_repositories) {
    const { createServerSupabase } = await import("./supabase-client");
    const {
      SupabaseProjectRepository,
      SupabaseStorageRepository,
      SupabaseReviewRepository,
      SupabaseReviewEditRepository,
    } = await import("./supabase");

    const supabase = await createServerSupabase();
    globalThis.__supabase_repositories = {
      projects: new SupabaseProjectRepository(supabase),
      storage: new SupabaseStorageRepository(supabase),
      reviews: new SupabaseReviewRepository(supabase),
      reviewEdits: new SupabaseReviewEditRepository(supabase),
    };
  }

  return globalThis.__supabase_repositories;
}
