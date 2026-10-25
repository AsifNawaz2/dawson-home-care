"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/attribution";

/** Keeps the landing page's utm_* for the lead forms (lib/attribution.ts). Renders nothing. */
export function Attribution() {
  useEffect(captureUtm, []);
  return null;
}
