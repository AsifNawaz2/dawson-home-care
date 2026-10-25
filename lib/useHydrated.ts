import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true after. Forms render their send button as
 * type="button" until then, so a click before React is ready can't fall back to a native GET
 * submit that would put names and phone numbers in the URL.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
