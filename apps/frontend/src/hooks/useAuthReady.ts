"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/** True after hydrate (and optional delay) before reading client auth state. */
export function useAuthReady(delayMs = 0): boolean {
  const hydrated = useHydrated();
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    if (!hydrated || delayMs <= 0) return;
    const timer = window.setTimeout(() => setDelayElapsed(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [hydrated, delayMs]);

  return hydrated && (delayMs <= 0 || delayElapsed);
}
