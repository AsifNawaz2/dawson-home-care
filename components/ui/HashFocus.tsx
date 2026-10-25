"use client";

/** Arriving with #{id}: scroll to that section and move focus to its heading (COPY_TRUST §05). */
import { useEffect } from "react";

export function HashFocus({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    const h = document.querySelector<HTMLElement>(`#${id} h2`);
    if (!h) return;
    h.setAttribute("tabindex", "-1");
    h.scrollIntoView({ block: "start" });
    h.focus({ preventScroll: true });
  }, [id]);
  return null;
}
