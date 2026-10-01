import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDeleteModeratedContentMutation } from "@/features/moderation/mutations";
import type { ModerationContentType } from "@/features/moderation/api";

interface DeleteContentModalProps {
  isOpen: boolean;
  toggle: () => void;
  type: ModerationContentType;
  id?: number;
  label: string;
}

function DeleteContentModal({ isOpen, toggle, type, id, label }: DeleteContentModalProps) {
  const deleteContentMutation = useDeleteModeratedContentMutation(type);

  const submitAction = () => {
    if (id) {
      deleteContentMutation.mutate(id, {
        onSuccess: () => {
          toggle();
        },
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Remove {label}</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Remove {label}</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              This takes the {label.toLowerCase()} down. It can be restored later from the
              &quot;Show removed&quot; view.
            </p>
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={`border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border text-center ${
                  deleteContentMutation.isPending ? "cursor-not-allowed opacity-70" : ""
                }`}
                onClick={submitAction}
                disabled={deleteContentMutation.isPending}
              >
                <p className={"text-[16px] font-medium text-white"}>Remove</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DeleteContentModal;
