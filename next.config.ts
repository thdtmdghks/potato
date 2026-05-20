import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.30.1.50"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "mfmnkeljqtozlcvztttf.supabase.co" },
    ],
  },
};

export default nextConfig;
