import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ThankYou } from "@/components/forms/ThankYou";
import "@/components/forms/forms.css";

export const metadata: Metadata = pageMetadata("/thank-you");

export default function ThankYouPage() {
  return <ThankYou />;
}
