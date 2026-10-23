/** Every storage read/write is wrapped: private windows and blocked storage must never break the site. */
export function readStorage(kind: "local" | "session", key: string): string | null {
  try {
    return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(kind: "local" | "session", key: string, value: string | null) {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* storage unavailable — behave as plain state */
  }
}
