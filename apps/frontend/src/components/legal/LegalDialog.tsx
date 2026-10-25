"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Dialog, DialogContentBare, DialogTitle, SafeHtml } from "@lemonade/ui";
import { useLegalPageQuery } from "@/features/help/queries";
import type { LegalCategory } from "@/features/help/api";

interface LegalDialogProps {
  category: LegalCategory;
  title: string;
  open: boolean;
  onClose: () => void;
}

// Shows a policy in a pop-up, for example from the sign up form. The text comes from the admin console.
export function LegalDialog({ category, title, open, onClose }: LegalDialogProps) {
  const { data, isError } = useLegalPageQuery(category, { enabled: open });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex h-[90vh] w-full max-w-200 flex-col overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b p-4">
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
              <CloseIcon />
            </button>
            <p className="tracking-custom text-body-xl font-sans font-semibold">{title}</p>
          </div>
          <div className="scrollbar-hide overflow-y-auto px-6 py-4">
            {data ? (
              <SafeHtml html={data.content} />
            ) : (
              <p className="text-text-grey text-body-s">
                {isError ? "We couldn't load this page. Please try again." : "Loading…"}
              </p>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}
