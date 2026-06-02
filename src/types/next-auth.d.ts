import "next-auth";
import "next-auth/jwt";
import type { UserRole } from "@/shared/constants";

declare module "next-auth" {
  interface Session {
    role?: UserRole;
    kakaoId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    kakaoId?: string;
  }
}
