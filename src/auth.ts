import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import { USER_ROLE } from "@/shared/constants";
import { maskName } from "@/shared/utils";

interface KakaoProfile {
  kakao_account?: {
    name?: string;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
    };
  };
}

const entries = (process.env.ADMIN_KAKAO_IDS ?? "")
  .split(",")
  .filter(Boolean)
  .map((entry) => {
    const [id, name] = entry.split(":");
    return { id: id.trim(), name: name?.trim() ?? "관리자" };
  });

const adminIds = entries.map((e) => e.id);

/** kakaoId → 관리자 이름 매핑 */
export const ADMIN_NAMES: Record<string, string> = Object.fromEntries(
  entries.map((e) => [e.id, e.name]),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Kakao],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "kakao") {
        token.kakaoId = account.providerAccountId;
        const kakaoAccount = (profile as KakaoProfile)?.kakao_account;
        if (kakaoAccount) {
          const rawName = kakaoAccount.name ?? kakaoAccount.profile?.nickname ?? "고객";
          token.name = maskName(rawName);
          token.picture = kakaoAccount.profile?.thumbnail_image_url ?? token.picture;
        }
      }
      if (token.kakaoId) {
        token.role = adminIds.includes(token.kakaoId) ? USER_ROLE.ADMIN : USER_ROLE.USER;
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role;
      session.kakaoId = token.kakaoId;
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
});
