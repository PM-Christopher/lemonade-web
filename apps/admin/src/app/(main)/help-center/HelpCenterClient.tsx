"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button, SafeHtml } from "@lemonade/ui";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { errorMessage } from "@/lib/api-error";
import { SearchBox } from "@/components/global/SearchBox";
import { FaqDialog } from "@/components/helpCenter/FaqDialog";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import type { Faq } from "@/features/helpCenter/api";
import { useFaqListQuery } from "@/features/helpCenter/queries";
import { useDeleteFaqMutation, useReorderFaqsMutation } from "@/features/helpCenter/mutations";

// The articles users read on the Help Center page.
function HelpCenterClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();
  const { data } = useFaqListQuery({ search: term });
  const remove = useDeleteFaqMutation();
  const reorder = useReorderFaqsMutation();
  // `null` is a new article; `undefined` means the dialog is closed.
  const [editing, setEditing] = useState<Faq | null | undefined>(undefined);
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs = data?.faqs ?? [];
  const categories = data?.categories ?? [];

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const move = (faq: Faq, direction: -1 | 1) => {
    const siblings = faqs.filter((item) => item.category === faq.category);
    const from = siblings.findIndex((item) => item.id === faq.id);
    const to = from + direction;
    if (to < 0 || to >= siblings.length) return;
    const ids = siblings.map((item) => item.id);
    [ids[from], ids[to]] = [ids[to], ids[from]];
    reorder.mutate(ids, {
      onError: (error) => toast(errorMessage(error, "Couldn't change the order."), "error"),
    });
  };

  const onDelete = (faq: Faq) => {
    if (!window.confirm(`Delete "${faq.question}"?`)) return;
    remove.mutate(faq.id, {
      onSuccess: () => toast(apiMessage("Article deleted"), "success"),
      onError: (error) => toast(errorMessage(error, "Couldn't delete that article."), "error"),
    });
  };

  return (
    <>
      <section className="mt-6 flex flex-col gap-5 px-5 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semiBold text-body-l">{faqs.length} Articles</p>
            <p className="text-text-grey text-body-s">
              Write in plain, friendly English. Users see published articles on the Help Center
              page.
            </p>
          </div>
          <div className="flex gap-3">
            <SearchBox
              value={searchValue}
              onChange={setSearchValue}
              label="Search articles"
              placeholder="Search questions and answers..."
            />
            <Button
              className="border-step-color bg-gradient-green flex h-10 rounded-xl"
              onClick={() => setEditing(null)}
            >
              <PlusIcon className="h-3.75 w-3.75 text-white" />
              <p className="text-body-l font-medium text-white">New article</p>
            </Button>
          </div>
        </div>

        {categories.map((category) => {
          const items = faqs.filter((faq) => faq.category === category.key);
          if (items.length === 0) return null;
          return (
            <div key={category.key} className="rounded-xl bg-white p-5">
              <h2 className="font-semiBold text-body-l mb-3">{category.label}</h2>
              <ul className="divide-grey-20 divide-y">
                {items.map((faq, index) => (
                  <li key={faq.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        aria-expanded={openId === faq.id}
                        className="text-body-s flex-1 cursor-pointer text-left font-medium"
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      >
                        {faq.question}
                        {!faq.is_published && (
                          <span className="bg-mid-grey text-text-grey ml-2 rounded-full px-2 py-0.5 text-xs">
                            Hidden
                          </span>
                        )}
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Move "${faq.question}" up`}
                          disabled={index === 0 || reorder.isPending}
                          className="cursor-pointer p-1 disabled:opacity-30"
                          onClick={() => move(faq, -1)}
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move "${faq.question}" down`}
                          disabled={index === items.length - 1 || reorder.isPending}
                          className="cursor-pointer p-1 disabled:opacity-30"
                          onClick={() => move(faq, 1)}
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit "${faq.question}"`}
                          className="cursor-pointer p-1"
                          onClick={() => setEditing(faq)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete "${faq.question}"`}
                          className="text-red-1 cursor-pointer p-1"
                          onClick={() => onDelete(faq)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {openId === faq.id && <SafeHtml html={faq.answer} className="mt-2" />}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {data && faqs.length === 0 && (
          <p className="text-text-grey text-body-s">No articles match.</p>
        )}
      </section>

      {editing !== undefined && (
        <FaqDialog
          key={editing?.id ?? "new"}
          faq={editing}
          categories={categories}
          isOpen
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            toast(apiMessage("Article saved"), "success");
            setEditing(undefined);
          }}
          onError={(message) => toast(message, "error")}
        />
      )}
    </>
  );
}

export default HelpCenterClient;
