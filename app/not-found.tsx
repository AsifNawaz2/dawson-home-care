import type { Metadata } from "next";
import { notFoundTitle } from "@/content/seo";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = {
  title: { absolute: notFoundTitle },
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
