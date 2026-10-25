"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContentBare,
  DialogTitle,
  FieldError,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import { HtmlEditor } from "@/components/global/HtmlEditor";
import { applyServerErrors } from "@/lib/form-errors";
import type { Faq, FaqCategory } from "@/features/helpCenter/api";
import { useSaveFaqMutation } from "@/features/helpCenter/mutations";
import { faqSchema, type FaqInput } from "@/features/helpCenter/schema";

interface FaqDialogProps {
  // Null for a new article.
  faq: Faq | null;
  categories: FaqCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}

// Adds or edits one help center article.
export function FaqDialog({ faq, categories, isOpen, onClose, onSaved, onError }: FaqDialogProps) {
  const save = useSaveFaqMutation();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    values: {
      category: faq?.category ?? categories[0]?.key ?? "",
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      is_published: faq?.is_published ?? true,
    },
  });

  const onSubmit = (values: FaqInput) =>
    save.mutate(
      { id: faq?.id, payload: values },
      {
        onSuccess: onSaved,
        onError: (error) => {
          if (applyServerErrors(error, setError, ["category", "question", "answer"])) return;
          onError(error?.message || "Something went wrong");
        },
      },
    );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{faq ? "Edit article" : "New article"}</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[92vh] w-200 max-w-[94vw] flex-col rounded-xl bg-white"
        >
          <div className="border-b-grey-20 flex items-center justify-between border-b p-5">
            <p className="text-body-l font-semibold">{faq ? "Edit article" : "New article"}</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="flex flex-col gap-5 overflow-y-auto p-5">
            <div className="grid gap-2">
              <Label htmlFor="faq-category" className="text-text-grey text-body-s font-normal">
                Section
              </Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="faq-category"
                      aria-label="Section"
                      className="h-10 rounded-xl"
                    >
                      <SelectValue placeholder="Choose a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.category?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faq-question" className="text-text-grey text-body-s font-normal">
                Question
              </Label>
              <Input
                id="faq-question"
                aria-invalid={errors.question ? true : undefined}
                {...register("question")}
              />
              <FieldError message={errors.question?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faq-answer" className="text-text-grey text-body-s font-normal">
                Answer
              </Label>
              <Controller
                control={control}
                name="answer"
                render={({ field }) => (
                  <HtmlEditor
                    id="faq-answer"
                    label="Answer"
                    value={field.value}
                    onChange={field.onChange}
                    heightClass="h-56"
                  />
                )}
              />
              <FieldError message={errors.answer?.message} />
            </div>
            <label className="text-body-s flex items-center gap-2">
              <input type="checkbox" {...register("is_published")} />
              Show this article on the Help Center
            </label>
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
                {save.isPending ? "Saving…" : "Save article"}
              </p>
            </button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}
