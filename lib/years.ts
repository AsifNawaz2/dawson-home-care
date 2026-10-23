import { FOUNDED_YEAR } from "@/content/site.config";

/** Years since 2002 — always computed, never hard-coded (05 Fix 6). */
export const yearsSinceFounding = (now: Date = new Date()) => now.getFullYear() - FOUNDED_YEAR;
