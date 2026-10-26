// What a support message can carry, mirroring the backend upload limits.
export const MAX_ATTACHMENTS = 4;
export const ACCEPTED_TYPES = "image/png,image/jpeg,video/mp4,video/quicktime,video/webm";

const IMAGE_MAX_MB = 10;
const VIDEO_MAX_MB = 50;
const IMAGE_TYPES = ["image/png", "image/jpeg"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

// Adds picked files to the ones already chosen and says why any were left out.
export function addAttachments(current: File[], picked: File[]) {
  const accepted: File[] = [];
  let error: string | null = null;

  for (const file of picked) {
    const isVideo = VIDEO_TYPES.includes(file.type);
    const limitMb = isVideo ? VIDEO_MAX_MB : IMAGE_MAX_MB;

    if (!isVideo && !IMAGE_TYPES.includes(file.type)) {
      error = `${file.name} isn't a supported picture or video.`;
    } else if (file.size > limitMb * 1024 * 1024) {
      error = `${file.name} is over ${limitMb}MB.`;
    } else if (current.length + accepted.length >= MAX_ATTACHMENTS) {
      error = `You can attach up to ${MAX_ATTACHMENTS} files per message.`;
    } else {
      accepted.push(file);
    }
  }

  return { files: [...current, ...accepted], error };
}
