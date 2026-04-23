import type {
  ProjectRepository,
  ProductRepository,
  InquiryRepository,
  StorageRepository,
} from './repositories';

interface Repositories {
  projects: ProjectRepository;
  products: ProductRepository;
  inquiries: InquiryRepository;
  storage: StorageRepository;
}

export async function getServerRepositories(): Promise<Repositories> {
  if (process.env.USE_MOCK === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getMockRepositories } = await import('./mock-repositories');
    return getMockRepositories();
  }

  const { createServerSupabase } = await import('./supabase-client');
  const {
    SupabaseProjectRepository,
    SupabaseProductRepository,
    SupabaseInquiryRepository,
    SupabaseStorageRepository,
  } = await import('./supabase-repositories');

  const supabase = await createServerSupabase();
  return {
    projects: new SupabaseProjectRepository(supabase),
    products: new SupabaseProductRepository(supabase),
    inquiries: new SupabaseInquiryRepository(supabase),
    storage: new SupabaseStorageRepository(supabase),
  };
}
