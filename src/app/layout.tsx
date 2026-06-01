import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { NavigationProgress } from "@/app/_components/navigation-progress";
import { SITE_URL, BUSINESS } from "@/shared/constants";
import "./globals.css";

import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS.name} - ${BUSINESS.slogan}`,
  description: `${BUSINESS.description} ${BUSINESS.phone}`,
  keywords: [
    "경산샤시",
    "대구샷시",
    "아파트샤시",
    "빌라샤시",
    "상가샤시",
    "베란다샤시",
    "방충망교체",
    "창호시공",
    "경산샤시업체",
    "대구샷시업체",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BUSINESS.name} - ${BUSINESS.slogan}`,
    description: "외풍·소음, 오래된 샤시 고민 한번에 해결. 경산·대구 당일 시공 가능. 010-3812-9922",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} - ${BUSINESS.slogan}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} - ${BUSINESS.slogan}`,
    description: "외풍·소음, 오래된 샤시 고민 한번에 해결. 경산·대구 당일 시공 가능. 010-3812-9922",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <meta name="naver-site-verification" content="fce7b03343405c89a5cb2636eec3eb59f270f590" />
        <meta
          name="google-site-verification"
          content="Cu1JoCVayI6up4Oj0VLtAMitzqo4v-aANlndWt4nuQg"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavigationProgress />
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
