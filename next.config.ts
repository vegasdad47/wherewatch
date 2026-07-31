import type { NextConfig } from "next";
import withBundleAnalyzerFactory from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

const withBundleAnalyzer = withBundleAnalyzerFactory({ enabled: process.env.ANALYZE === "true" });

export default withBundleAnalyzer(nextConfig);
