"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { ChevronLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { errorMessage } from "@/lib/api-error";
import { routes } from "@/lib/routes";
import { SearchBox } from "@/components/global/SearchBox";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import type { Category, CategoryType } from "@/features/categories/api";
import { useCategoryListQuery } from "@/features/categories/queries";
import { useDeleteCategoryMutation } from "@/features/categories/mutations";

// Where each list is used, so the page can lead back to it.
const SOURCE: Record<CategoryType, { label: string; href: string; hint: string }> = {
  tribes: {
    label: "Tribes",
    href: routes.TRIBES,
    hint: "People pick one of these when they create a tribe.",
  },
  business: {
    label: "Businesses",
    href: routes.BUSINESSES,
    hint: "Business owners pick from these when they list a business.",
  },
  report: {
    label: "Reporting",
    href: routes.REPORTING,
    hint: "People pick one of these as the reason when they report a thread.",
  },
};

// Add, rename and remove the options in one category list.
export function CategoriesManager({ type }: { type: CategoryType }) {
  const dispatch = useDispatch<AppDispatch>();
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();
  const { data, isLoading } = useCategoryListQuery(type, { search: term });
  const remove = useDeleteCategoryMutation();
  // `null` is a new category; `undefined` means the dialog is closed.
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);

  const source = SOURCE[type];
  const categories = data?.categories ?? [];

  const toast = (message: string, kind: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type: kind }));

  const onDelete = (category: Category) => {
    if (!window.confirm(`Remove "${category.name}"? Items already using it keep their label.`))
      return;
    remove.mutate(category.id, {
      onSuccess: () => toast(apiMessage("Category removed"), "success"),
      onError: (error) => toast(errorMessage(error, "Couldn't remove that category."), "error"),
    });
  };

  return (
    <>
      <section className="mt-6 flex flex-col gap-5 px-5">
        <Link
          href={source.href}
          className="text-body-s text-text-grey flex w-fit items-center gap-1 font-medium"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to {source.label}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semiBold text-body-l">
              {data?.label ?? "Categories"} ({categories.length})
            </p>
            <p className="text-text-grey text-body-s">{source.hint}</p>
          </div>
          <div className="flex gap-3">
            <SearchBox
              value={searchValue}
              onChange={setSearchValue}
              label="Search categories"
              placeholder="Search categories..."
            />
            <Button
              className="border-step-color bg-gradient-green flex h-10 rounded-xl"
              onClick={() => setEditing(null)}
            >
              <PlusIcon className="h-3.75 w-3.75 text-white" />
              <p className="text-body-l font-medium text-white">New category</p>
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5">
          {categories.length > 0 ? (
            <ul className="divide-grey-20 divide-y">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-body-s font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-text-grey text-meta truncate">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      className="cursor-pointer p-1"
                      onClick={() => setEditing(category)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${category.name}`}
                      className="text-red-1 cursor-pointer p-1"
                      disabled={remove.isPending}
                      onClick={() => onDelete(category)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-grey text-body-s">
              {isLoading ? "Loading..." : "No categories yet."}
            </p>
          )}
        </div>
      </section>

      {editing !== undefined && (
        <CategoryDialog
          key={editing?.id ?? "new"}
          type={type}
          category={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            toast(apiMessage("Category saved"), "success");
            setEditing(undefined);
          }}
          onError={(message) => toast(message, "error")}
        />
      )}
    </>
  );
}
