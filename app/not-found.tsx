import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found | Dawson & Dawson Home Care",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
