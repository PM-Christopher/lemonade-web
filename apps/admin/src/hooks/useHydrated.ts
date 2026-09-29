import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True after the client has taken over from the server render.
 * useSyncExternalStore is the supported replacement for a mount effect
 * that flips a hydrated flag, which react-hooks now flags as a cascading
 * setState.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
