import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";

const providers = [];
if (process.env.AUTH_KAKAO_ID && process.env.AUTH_KAKAO_SECRET) {
  providers.push(Kakao);
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
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "kakao") {
        token.kakaoId = account.providerAccountId;
        const kakaoProfile = (
          profile as {
            kakao_account?: {
              profile?: {
                nickname?: string;
                thumbnail_image_url?: string;
              };
            };
          }
        )?.kakao_account?.profile;
        if (kakaoProfile) {
          token.name = kakaoProfile.nickname ?? token.name;
          token.picture = kakaoProfile.thumbnail_image_url ?? token.picture;
        }
      }
      if (token.kakaoId) {
        token.role = adminIds.includes(token.kakaoId) ? "admin" : "user";
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
