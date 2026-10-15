// File picker helpers.

/** True for image files only (the picker's `accept` can still be bypassed). */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
