import type { NextConfig } from "next";

/**
 * Local dev: a normal Next.js server with the image optimiser.
 * GitHub Pages: STATIC_EXPORT=true writes a static site to /out, served under
 * NEXT_PUBLIC_BASE_PATH (e.g. /hotel-raviraj). Both are set by the deploy workflow.
 */
const isExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  images: {
    unoptimized: isExport,
    formats: ["image/webp"],
    qualities: [60, 75, 85],
  },
};

export default nextConfig;
