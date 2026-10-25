// Safe "return to where you were" paths for login redirects.

const PLACEHOLDER_ORIGIN = "http://redirect.invalid";
const MAX_LENGTH = 2048;
// Backslashes and control characters are read as slashes or stripped by some browsers.
const UNSAFE_CHARACTERS = /[\u0000-\u001f\u007f\\]/;

/**
 * Returns the path to go to, or `fallback` when `raw` could lead off this site.
 * Only a plain path on the same site passes. Full addresses, `//host`, `/\host`,
 * encoded slashes and control characters are all refused. Paths listed in
 * `blocked` (such as the login page) are refused too, so nobody loops.
 */
export function safeRedirectPath(
  raw: string | null | undefined,
  fallback = "/",
  blocked: readonly string[] = [],
): string {
  if (!raw || raw.length > MAX_LENGTH) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || UNSAFE_CHARACTERS.test(raw)) return fallback;

  let url: URL;
  try {
    url = new URL(raw, PLACEHOLDER_ORIGIN);
  } catch {
    return fallback;
  }
  if (url.origin !== PLACEHOLDER_ORIGIN || url.pathname.startsWith("//")) return fallback;

  try {
    const decoded = decodeURIComponent(url.pathname);
    if (/^\/[\\/]/.test(decoded) || UNSAFE_CHARACTERS.test(decoded)) return fallback;
  } catch {
    return fallback;
  }

  const path = url.pathname;
  if (blocked.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return fallback;

  return `${path}${url.search}${url.hash}`;
}

/** The login address to send a signed-out visitor to, remembering where they were headed. */
export function loginPathFor(
  loginPath: string,
  returnTo: string | null | undefined,
  blocked: readonly string[] = [],
): string {
  const safe = safeRedirectPath(returnTo, "/", [loginPath, ...blocked]);
  return safe === "/" ? loginPath : `${loginPath}?next=${encodeURIComponent(safe)}`;
}
