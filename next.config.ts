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
  experimental: {
    // The on-disk dev cache once served a stale styles/globals.css after edits made while the
    // server was stopped (Tailwind's @custom-variant rules went missing). The Codespace preview
    // must always show the current code, so the dev server compiles fresh on each start.
    turbopackFileSystemCacheForDev: false,
  },
  // The dev badge sits on the Comfort settings button (bottom-left). Build errors still overlay.
  devIndicators: false,
};

export default nextConfig;
