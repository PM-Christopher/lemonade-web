/** Public `/images/*` paths — prefer these over string literals. */
export const images = {
  LOGO: "/images/logo.png",
  LEMON: "/images/lemon.png",
  DEFAULT_TRIBE: "/images/tribe_1.png",
  BUSINESS_BG: "/images/business-bg.png",
  BUSINESS_JOB_LOGO: "/images/business/jobLogo.png",
  MEDAL: "/images/medal.png",
  VERIFIED: "/images/verified.png",
  UPLOAD: "/images/upload.png",
  AVATAR_1: "/images/avatar_1.png",
} as const;

export type AppImage = (typeof images)[keyof typeof images];
