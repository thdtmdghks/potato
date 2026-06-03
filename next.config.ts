import type { NextConfig } from "next";
import "./src/shared/env";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.8"],
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
