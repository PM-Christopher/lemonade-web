import React from "react";

// A name with a small round picture, or the first letter when there is none.
export function AvatarName({
  name,
  image,
}: {
  name: string | null | undefined;
  image?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="bg-mid-grey text-text-grey flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {(name ?? "?").charAt(0).toUpperCase()}
        </div>
      )}
      <span className="truncate">{name ?? "N/A"}</span>
    </div>
  );
}
