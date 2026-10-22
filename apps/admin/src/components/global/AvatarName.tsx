import React from "react";
import { Avatar } from "@/components/global/Avatar";

// A name with a small round picture, or the initials when there is none.
export function AvatarName({
  name,
  image,
  fallbackSrc,
}: {
  name: string | null | undefined;
  image?: string | null;
  fallbackSrc?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} image={image} fallbackSrc={fallbackSrc} />
      <span className="truncate">{name ?? "N/A"}</span>
    </div>
  );
}
