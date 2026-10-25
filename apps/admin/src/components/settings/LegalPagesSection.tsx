"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { errorMessage } from "@/lib/api-error";
import { HtmlEditor } from "@/components/global/HtmlEditor";
import type { PageCategory, PolicyPage } from "@/features/pages/api";
import { useSavePolicyPageMutation } from "@/features/pages/mutations";

// One page: the text shows as saved until the admin starts typing.
function PageEditor({ page }: { page: PolicyPage }) {
  const dispatch = useDispatch<AppDispatch>();
  const save = useSavePolicyPageMutation();
  const [draft, setDraft] = useState<string | null>(null);
  const content = draft ?? page.content;

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const onSave = () =>
    save.mutate(
      { category: page.category as PageCategory, content },
      {
        onSuccess: () => {
          setDraft(null);
          toast(apiMessage("Page saved"), "success");
        },
        onError: (error) => toast(errorMessage(error, "Couldn't save that page."), "error"),
      },
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semiBold text-body-l">{page.title}</h3>
        {page.is_default && (
          <span className="bg-mid-grey text-text-grey rounded-full px-2 py-0.5 text-xs">
            Starting text, not saved yet
          </span>
        )}
      </div>
      <HtmlEditor
        id={`page-${page.category}`}
        label={page.title}
        value={content}
        onChange={setDraft}
      />
      <button
        type="button"
        disabled={save.isPending || (draft === null && !page.is_default)}
        onClick={onSave}
        className="border-step-color bg-gradient-green h-10 w-fit rounded-xl border px-6 disabled:opacity-60"
      >
        <p className="text-body-s font-medium text-white">
          {save.isPending ? "Saving…" : "Save page"}
        </p>
      </button>
    </div>
  );
}

// Terms, privacy, cookie and community pages. Saved text shows on the website straight away.
export function LegalPagesSection({ pages }: { pages: PolicyPage[] }) {
  const [active, setActive] = useState<string>(pages[0]?.category ?? "");
  const page = pages.find((item) => item.category === active) ?? pages[0];

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="flex max-w-full gap-2 overflow-x-auto">
        {pages.map((item) => (
          <button
            key={item.category}
            type="button"
            role="tab"
            aria-selected={item.category === page?.category}
            className={`text-body-s shrink-0 cursor-pointer rounded-lg px-3 py-2 font-medium whitespace-nowrap ${item.category === page?.category ? "bg-mid-grey" : "text-text-grey"}`}
            onClick={() => setActive(item.category)}
          >
            {item.title}
          </button>
        ))}
      </div>
      {page && <PageEditor key={page.category} page={page} />}
    </div>
  );
}
