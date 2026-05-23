import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, BUSINESS } from "@/shared/constants";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS.name} - ${BUSINESS.slogan}`,
  description: `${BUSINESS.description} ${BUSINESS.phone}`,
  openGraph: {
    title: `${BUSINESS.name} - ${BUSINESS.slogan}`,
    description: "외풍·소음, 오래된 샤시 고민 한번에 해결. 당일 시공 가능.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="naver-site-verification" content="4c6dab20be04767928aaeacb20a4575d4e733bfb" />
        <meta
          name="google-site-verification"
          content="Cu1JoCVayI6up4Oj0VLtAMitzqo4v-aANlndWt4nuQg"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
