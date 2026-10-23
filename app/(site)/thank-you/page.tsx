import type { Metadata } from "next";
import { ThankYou } from "@/components/forms/ThankYou";
import "@/components/forms/forms.css";

export const metadata: Metadata = {
  title: "Thank You | Dawson & Dawson Home Care",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
