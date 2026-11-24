import { useCallback, useRef, useSyncExternalStore } from "react";
import { connectApi } from "./api";

// How long "is typing" stays after the last signal.
const TYPING_MS = 3500;
// At most one signal this often while someone keeps typing.
const SEND_EVERY_MS = 2500;

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const listeners = new Set<() => void>();
let typingNow: ReadonlySet<string> = new Set();

const setTyping = (next: ReadonlySet<string>) => {
  typingNow = next;
  listeners.forEach((listener) => listener());
};

/** The other person is typing right now. It clears itself a few seconds later. */
export function markTyping(userId: string): void {
  clearTimeout(timers.get(userId));
  if (!typingNow.has(userId)) setTyping(new Set(typingNow).add(userId));
  timers.set(
    userId,
    setTimeout(() => clearTyping(userId), TYPING_MS),
  );
}

/** They stopped, for example because their message just arrived. */
export function clearTyping(userId: string): void {
  clearTimeout(timers.get(userId));
  timers.delete(userId);
  if (!typingNow.has(userId)) return;
  const next = new Set(typingNow);
  next.delete(userId);
  setTyping(next);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useIsTyping(userId: string | undefined): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (userId ? typingNow.has(userId) : false),
    () => false,
  );
}

/** Tells the other person you are typing, without flooding the server. */
export function useTypingSignal(receiverId: string | undefined): () => void {
  const lastSent = useRef(0);

  return useCallback(() => {
    if (!receiverId) return;
    const now = Date.now();
    if (now - lastSent.current < SEND_EVERY_MS) return;
    lastSent.current = now;
    // A missed typing signal is harmless.
    connectApi.sendTyping(receiverId).catch(() => undefined);
  }, [receiverId]);
}
