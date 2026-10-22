import React from "react";
import { Avatar } from "@/components/global/Avatar";

// A name with a small round picture, or the initials when there is none.
export function AvatarName({
  name,
  image,
}: {
  name: string | null | undefined;
  image?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} image={image} />
      <span className="truncate">{name ?? "N/A"}</span>
    </div>
  );
}
