const ALLOWED_IMAGE_HOSTS = [
  "dev-lemonade-bucket.lon1.digitaloceanspaces.com",
  "res.cloudinary.com",
  ...(process.env.NEXT_PUBLIC_LOCAL_IMAGE_HOST ? [process.env.NEXT_PUBLIC_LOCAL_IMAGE_HOST] : []),
];

/** The url when it comes from a host we load images from, otherwise the fallback. */
export function getSafeImageSrc(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    return ALLOWED_IMAGE_HOSTS.includes(new URL(url).hostname) ? url : fallback;
  } catch {
    return fallback;
  }
}
