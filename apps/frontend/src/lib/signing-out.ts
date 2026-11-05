// Marks an intentional logout so the 401 that follows does not add a return address to login.
const WINDOW_MS = 10_000;
let startedAt = 0;

export function markSigningOut(): void {
  startedAt = Date.now();
}

export function isSigningOut(): boolean {
  return Date.now() - startedAt < WINDOW_MS;
}
