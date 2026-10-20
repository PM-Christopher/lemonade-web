"use client";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, RichTextField } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { announcementsApi, type PageContentCategory } from "@/features/announcements/api";
import { usePageContentQuery } from "@/features/announcements/queries";
import { useSavePageContentMutation } from "@/features/announcements/mutations";

interface PageContentModalProps {
  isOpen: boolean;
  toggle: () => void;
  category: PageContentCategory;
  title: string;
}

// Edits one of the policy pages (terms, privacy, community guidelines).
function PageContentModal({ isOpen, toggle, category, title }: PageContentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = usePageContentQuery({ enabled: isLoggedIn && isOpen });
  const saveMutation = useSavePageContentMutation();
  // What the admin has typed; until then the saved text shows.
  const [draft, setDraft] = useState<string | null>(null);
  const saved = data?.page_content?.[category] ?? "";
  const content = draft ?? saved;

  const close = () => {
    setDraft(null);
    toggle();
  };

  const save = () => {
    saveMutation.mutate(
      { category, content },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Page saved"),
              type: "success",
            }),
          );
          close();
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex max-h-[92vh] w-200 max-w-[94vw] flex-col rounded-xl bg-white">
          <div className="border-b-grey-20 flex items-center justify-between border-b p-5">
            <p className="text-body-l font-sans font-semibold">{title}</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={close}>
              <XIcon />
            </button>
          </div>
          <div className="overflow-y-auto p-5">
            <RichTextField
              id="page-content"
              value={content}
              onChange={setDraft}
              onUploadImage={announcementsApi.uploadMedia}
              onUploadVideo={announcementsApi.uploadMedia}
              heightClass="h-80"
            />
          </div>
          <div className="border-t-grey-20 flex gap-3 border-t p-5">
            <button
              type="button"
              className="border-light-grey-50 h-10 rounded-xl border bg-white px-6"
              onClick={close}
            >
              <p className="text-body-s font-medium text-black">Cancel</p>
            </button>
            <button
              type="button"
              className="border-step-color bg-gradient-green h-10 rounded-xl border px-6 disabled:opacity-60"
              onClick={save}
              disabled={saveMutation.isPending}
            >
              <p className="text-body-s font-medium text-white">Save changes</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default PageContentModal;
