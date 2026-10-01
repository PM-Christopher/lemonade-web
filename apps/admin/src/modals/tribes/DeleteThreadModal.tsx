import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useDeleteTribeThreadMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface DeleteThreadModalProps {
  isOpen: boolean;
  toggle: () => void;
  tribeId: string;
  threadId?: string;
}

function DeleteThreadModal({ isOpen, toggle, tribeId, threadId }: DeleteThreadModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const deleteThreadMutation = useDeleteTribeThreadMutation(tribeId);

  const submitAction = () => {
    if (!threadId) return;
    deleteThreadMutation.mutate(threadId, {
      onSuccess: () => {
        toggle();
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
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Delete thread</DialogTitle>
        <div className="w-[360px] rounded-[12px] bg-white pt-[16px] pb-[4px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Delete thread</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to delete this thread? This can&apos;t be undone.
            </p>
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={
                  "border-light-grey-50 h-[48px] w-[156px] rounded-[12px] border-[1px] bg-white"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "border-red-2 bg-red-1 h-[48px] w-[156px] rounded-[12px] border-[1px] text-center"
                }
                onClick={submitAction}
                disabled={deleteThreadMutation.isPending}
              >
                <p className={"text-[16px] font-medium text-white"}>
                  {deleteThreadMutation.isPending ? "Deleting..." : "Delete"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DeleteThreadModal;
