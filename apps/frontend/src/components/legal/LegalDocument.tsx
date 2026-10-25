import React from "react";
import { SafeHtml } from "@lemonade/ui";
import type { PublicPage } from "@/features/help/api";

// A policy page: the title, the text, and when it was last changed.
export function LegalDocument({ page }: { page: PublicPage }) {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-body-xl font-semibold">{page.title}</h1>
      {page.updated_at && (
        <p className="text-text-grey text-meta">
          Last updated{" "}
          {new Date(page.updated_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <SafeHtml html={page.content} />
    </article>
  );
}
