import type { NextConfig } from "next";
import { redirects } from "./content/redirects";

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
  // Legacy WordPress URLs → new pages, 301 (SEO_PLAN §5.2). The 410s live in proxy.ts.
  redirects: async () => redirects,
  // 08 §6 names the Turnstile key TURNSTILE_SITE_KEY; the browser widget needs it inlined.
  env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY ?? "" },
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
