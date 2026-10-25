"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, FieldError, Input, Label } from "@lemonade/ui";
import { applyServerErrors } from "@/lib/form-errors";
import type { Category, CategoryType } from "@/features/categories/api";
import { useSaveCategoryMutation } from "@/features/categories/mutations";
import { categorySchema, type CategoryInput } from "@/features/categories/schema";

interface CategoryDialogProps {
  type: CategoryType;
  // Null for a new category.
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}

// Adds or renames one category.
export function CategoryDialog({ type, category, onClose, onSaved, onError }: CategoryDialogProps) {
  const save = useSaveCategoryMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "", description: category?.description ?? "" },
  });

  const title = category ? "Edit category" : "New category";

  const onSubmit = (values: CategoryInput) =>
    save.mutate(
      { id: category?.id, payload: { type, ...values } },
      {
        onSuccess: onSaved,
        onError: (error) => {
          if (applyServerErrors(error, setError, ["name", "description"])) return;
          // Name clashes come back as a plain message.
          if (/already exists/i.test(error?.message ?? "")) {
            setError("name", { type: "server", message: error.message });
            return;
          }
          onError(error?.message || "Something went wrong");
        },
      },
    );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-120 max-w-[94vw] flex-col rounded-xl bg-white"
        >
          <div className="border-b-grey-20 flex items-center justify-between border-b p-5">
            <p className="text-body-l font-semibold">{title}</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <div className="grid gap-2">
              <Label htmlFor="category-name" className="text-text-grey text-body-s font-normal">
                Name
              </Label>
              <Input
                id="category-name"
                aria-invalid={errors.name ? true : undefined}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="category-description"
                className="text-text-grey text-body-s font-normal"
              >
                Description (optional)
              </Label>
              <Input
                id="category-description"
                aria-invalid={errors.description ? true : undefined}
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </div>
          <div className="border-t-grey-20 flex gap-3 border-t p-5">
            <button
              type="button"
              className="border-light-grey-50 h-10 rounded-xl border bg-white px-6"
              onClick={onClose}
            >
              <p className="text-body-s font-medium text-black">Cancel</p>
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="border-step-color bg-gradient-green h-10 rounded-xl border px-6 disabled:opacity-60"
            >
              <p className="text-body-s font-medium text-white">
                {save.isPending ? "Saving…" : "Save category"}
              </p>
            </button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}
