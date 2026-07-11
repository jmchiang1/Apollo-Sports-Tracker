import type { NextConfig } from "next";

// For a GitHub Pages *project* site the app is served from https://<user>.github.io/<repo>/,
// so both routes and assets need that "/<repo>" prefix. The deploy workflow injects it via
// NEXT_PUBLIC_BASE_PATH (derived automatically from the Pages config — no hardcoding).
// Locally the var is unset, so the app is served from the root as usual.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // static HTML/CSS/JS into ./out — no Node server required
  images: { unoptimized: true }, // next/image needs this under static export
  basePath: basePath || undefined,
  trailingSlash: true, // emit /roadmap/index.html so GitHub Pages resolves routes cleanly
};

export default nextConfig;
