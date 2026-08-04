import type { NextConfig } from "next";
import withBundleAnalyzerFactory from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    // Disable Vercel image optimization — TMDB already serves optimized WebP.
    // This saves ~$60/month in image optimization fees.
    unoptimized: true,
  },
};

const withBundleAnalyzer = withBundleAnalyzerFactory({ enabled: process.env.ANALYZE === "true" });

export default withBundleAnalyzer(nextConfig);
