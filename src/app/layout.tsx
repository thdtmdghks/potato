import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export const metadata: Metadata = {
  title: "경산창호 - 경산·대구 샷시 전문 시공",
  description:
    "40년 경력 샷시 전문 시공. 하이샷시, 방충망, 유리교체, ABS도어, 방범창. 경산·대구 당일시공 가능. 010-3812-9922",
  openGraph: {
    title: "경산창호 - 경산·대구 샷시 전문 시공",
    description: "외풍·소음, 오래된 샷시 고민 한번에 해결. 40년 경력, 당일 시공 가능.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
