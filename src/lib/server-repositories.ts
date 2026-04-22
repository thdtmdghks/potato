import { createServerSupabase } from "./supabase-server";
import {
  SupabaseProjectRepository,
  SupabaseProductRepository,
  SupabaseInquiryRepository,
  SupabaseStorageRepository,
  SupabaseAuthRepository,
} from "./supabase-repositories";

export async function getServerRepositories() {
  const supabase = await createServerSupabase();
  return {
    projects: new SupabaseProjectRepository(supabase),
    products: new SupabaseProductRepository(supabase),
    inquiries: new SupabaseInquiryRepository(supabase),
    storage: new SupabaseStorageRepository(supabase),
    auth: new SupabaseAuthRepository(supabase),
  };
}
