import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

export function createProxyAuth(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return {
    async getUser(): Promise<{ id: string } | null> {
      const { data } = await supabase.auth.getUser();
      return data.user ? { id: data.user.id } : null;
    },
  };
}
