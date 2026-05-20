import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";

const providers = [];
if (process.env.AUTH_KAKAO_ID && process.env.AUTH_KAKAO_SECRET) {
  providers.push(Kakao);
}

const adminIds = (process.env.ADMIN_KAKAO_IDS ?? "").split(",").filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "kakao") {
        token.kakaoId = account.providerAccountId;
      }
      if (token.kakaoId) {
        token.role = adminIds.includes(token.kakaoId) ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role;
      session.kakaoId = token.kakaoId;
      return session;
    },
  },
});
