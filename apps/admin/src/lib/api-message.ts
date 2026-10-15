// Shows the backend's own success message, with a front-end default when it is blank.

let lastMessage: string | undefined;

/** Returns the message, or the fallback when it is null, undefined or blank. */
export function messageOr(message: string | null | undefined, fallback: string): string {
  return message?.trim() ? message : fallback;
}

/** Stores the message of the latest successful API response. */
export function rememberApiMessage(message: string): void {
  lastMessage = message;
}

/** Latest API success message (used once), or the fallback when there is none. */
export function apiMessage(fallback: string): string {
  const message = lastMessage;
  lastMessage = undefined;
  return messageOr(message, fallback);
}
