import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dawson & Dawson Home Care",
    short_name: "Dawson Care",
    start_url: "/",
    display: "browser",
    background_color: "#FBF8F3",
    theme_color: "#FBF8F3",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
