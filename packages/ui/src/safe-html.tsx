import React from "react";
import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "hr",
    "a",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: { a: ["href", "title", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
  },
};

// Removes scripts, styles, images, event handlers and unsafe links. The server cleans it too.
export const cleanHtml = (html: string) => sanitizeHtml(html, OPTIONS);

const STYLE =
  "break-words text-body-s leading-relaxed [&_a]:text-light-green [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-semibold [&_hr]:my-4 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6";

// Shows rich text written in the admin console. Only basic formatting is ever rendered.
export const SafeHtml = ({ html, className = "" }: { html: string; className?: string }) => (
  <div className={`${STYLE} ${className}`} dangerouslySetInnerHTML={{ __html: cleanHtml(html) }} />
);
