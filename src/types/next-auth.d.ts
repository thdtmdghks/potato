import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    role?: string;
    kakaoId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    kakaoId?: string;
  }
}
