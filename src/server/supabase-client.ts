import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types";

export const createServerSupabase = () => {
  const url = process.env.SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient<Database>(url, serviceRoleKey);
};
