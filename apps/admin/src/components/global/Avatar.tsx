import React from "react";

type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

/** Up to two initials, e.g. "Charles Ajimobi" gives "CA". */
export function getInitials(name: string | null | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const letters =
    words.length === 1 ? words[0].slice(0, 1) : words[0][0] + words[words.length - 1][0];
  return letters.toUpperCase();
}

// A round picture, or the person's initials when there is none.
export function Avatar({
  name,
  image,
  size = "sm",
  className = "",
}: {
  name: string | null | undefined;
  image?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const box = `${SIZES[size]} shrink-0 rounded-full ${className}`;
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className={`${box} object-cover`} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`${box} bg-step-color flex items-center justify-center font-semibold text-white`}
    >
      {getInitials(name)}
    </div>
  );
}
