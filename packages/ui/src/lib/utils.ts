import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Must match the roles in packages/config/typography.css. tailwind-merge treats
// unknown `text-*` classes as colors, which would drop either the size or
// the color when both are on one element.
export const typeScale = [
  "display-xl",
  "display-l",
  "display-r",
  "display-s",
  "display-xs",
  "title-xl",
  "title-l",
  "title-r",
  "body-xl",
  "body-l",
  "body-s",
  "button",
  "button-sm",
  "field",
  "label",
  "meta",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...typeScale] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
