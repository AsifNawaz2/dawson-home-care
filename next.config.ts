import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // GitHub Codespaces serves the dev server from *.app.github.dev.
  allowedDevOrigins: ["*.app.github.dev", "**.github.dev", "**.githubpreview.dev"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  poweredByHeader: false,
  // The dev badge sits on the Comfort settings button (bottom-left). Build errors still overlay.
  devIndicators: false,
};

export default nextConfig;
