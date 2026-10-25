"use client";
import React, { useState } from "react";
import { SafeHtml } from "@lemonade/ui";
import { SearchIcon } from "lucide-react";
import { useFaqsQuery } from "@/features/help/queries";
import useDebounce from "@/hooks/useDebounce";

// Questions and answers by topic, with a search box and the support contact.
export function HelpCenter() {
  const [value, setValue] = useState("");
  const { debouncedValue } = useDebounce(value, 400);
  const term = debouncedValue.trim();
  const { data } = useFaqsQuery(term);
  const sections = data?.sections ?? [];
  const support = data?.support;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-body-xl font-semibold">Help center</h1>
        <p className="text-text-grey text-body-s">Quick answers to the most common questions.</p>
      </div>

      <div className="border-grey-20 flex h-11 items-center gap-3 rounded-xl border bg-white px-3">
        <SearchIcon className="text-grey-40 h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search help articles"
          placeholder="Search for help, like “create a tribe”"
          className="text-body-s w-full bg-transparent focus:outline-none"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      {sections.length === 0 && data && (
        <p className="text-text-grey text-body-s">
          We couldn&apos;t find an answer for that. Try other words, or contact us below.
        </p>
      )}

      {sections.map((section) => (
        <section key={section.key} aria-labelledby={`help-${section.key}`}>
          <h2 id={`help-${section.key}`} className="text-body-l mb-2 font-semibold">
            {section.label}
          </h2>
          <div className="divide-grey-20 divide-y rounded-xl bg-white">
            {section.faqs.map((faq) => (
              <details key={faq.id} className="group px-4 py-3" open={term !== ""}>
                <summary className="text-body-s cursor-pointer list-none font-medium marker:hidden">
                  {faq.question}
                </summary>
                <SafeHtml html={faq.answer} className="text-text-grey mt-2" />
              </details>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl bg-white p-5" aria-labelledby="help-contact">
        <h2 id="help-contact" className="text-body-l font-semibold">
          Still need help?
        </h2>
        {support?.email || support?.phone ? (
          <ul className="text-body-s mt-2 flex flex-col gap-1">
            {support.email && (
              <li>
                Email us at{" "}
                <a className="text-light-green underline" href={`mailto:${support.email}`}>
                  {support.email}
                </a>
              </li>
            )}
            {support.phone && (
              <li>
                Call us on{" "}
                <a
                  className="text-light-green underline"
                  href={`tel:${support.phone.replace(/[^0-9+]/g, "")}`}
                >
                  {support.phone}
                </a>
              </li>
            )}
          </ul>
        ) : (
          <p className="text-text-grey text-body-s mt-2">
            Send a message to Support from Settings, then Support messages.
          </p>
        )}
      </section>
    </div>
  );
}
