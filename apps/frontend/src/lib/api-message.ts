// Shows the backend's own success message, with a front-end default when it is blank.

// A remembered message is only valid for a few seconds, so it can't leak into a later toast.
const MAX_AGE_MS = 5000;

let lastMessage: { text: string; at: number } | undefined;

/** Returns the message, or the fallback when it is null, undefined or blank. */
export function messageOr(message: string | null | undefined, fallback: string): string {
  return message?.trim() ? message : fallback;
}

/** Stores the message of the latest successful API response. */
export function rememberApiMessage(message: string): void {
  lastMessage = { text: message, at: Date.now() };
}

/** Latest fresh API success message (used once), or the fallback when there is none. */
export function apiMessage(fallback: string): string {
  const remembered = lastMessage;
  lastMessage = undefined;
  const isFresh = remembered !== undefined && Date.now() - remembered.at <= MAX_AGE_MS;
  return messageOr(isFresh ? remembered.text : undefined, fallback);
}
