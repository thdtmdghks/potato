import type { NextConfig } from "next";
import "./src/shared/env";

const authHost = process.env.AUTH_URL ? [new URL(process.env.AUTH_URL).hostname] : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: authHost,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "mfmnkeljqtozlcvztttf.supabase.co" },
      { protocol: "http", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
