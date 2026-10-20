import React from "react";
import { GlobeIcon } from "lucide-react";

const BRANDS: Record<string, { label: string; className: string }> = {
  facebook: { label: "f", className: "bg-[#1877f2] text-white" },
  instagram: { label: "ig", className: "bg-[#d6249f] text-white" },
  linkedin: { label: "in", className: "bg-[#0a66c2] text-white" },
  twitter: { label: "X", className: "bg-black text-white" },
  x: { label: "X", className: "bg-black text-white" },
};

// A social profile link shown as a small brand badge, or a globe for anything else.
export function SocialLink({ name, href }: { name: string; href: string }) {
  const brand = BRANDS[name.toLowerCase()];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      title={name}
      className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
        brand?.className ?? "text-text-grey"
      }`}
    >
      {brand ? brand.label : <GlobeIcon className="h-5 w-5" />}
    </a>
  );
}
