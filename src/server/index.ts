import type { Repositories } from "./repositories";

declare global {
  var __mock_repositories: Repositories | undefined;
  var __supabase_repositories: Repositories | undefined;
}

export async function getServerRepositories(): Promise<Repositories> {
  if (process.env.USE_MOCK === "true" || !process.env.SUPABASE_URL) {
    if (!globalThis.__mock_repositories) {
      const { createMockRepositories } = await import("./mock-repositories");
      globalThis.__mock_repositories = createMockRepositories();
    }
    return globalThis.__mock_repositories;
  }

  if (!globalThis.__supabase_repositories) {
    const { createServerSupabase } = await import("./supabase-client");
    const {
      SupabaseProjectRepository,
      SupabaseProductRepository,
      SupabaseInquiryRepository,
      SupabaseStorageRepository,
    } = await import("./supabase-repositories");

    const supabase = await createServerSupabase();
    globalThis.__supabase_repositories = {
      projects: new SupabaseProjectRepository(supabase),
      products: new SupabaseProductRepository(supabase),
      inquiries: new SupabaseInquiryRepository(supabase),
      storage: new SupabaseStorageRepository(supabase),
    };
  }

  return globalThis.__supabase_repositories;
}
