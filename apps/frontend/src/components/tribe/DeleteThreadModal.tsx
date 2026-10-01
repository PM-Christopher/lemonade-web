import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useDeleteThreadMutation } from "@/features/tribes/mutations";

interface DeleteThreadIF {
  toggle: () => void;
  isOpen: boolean;
  threadId: number | null;
  setThreadId: (threadId: number | null) => void;
  tribeId: string;
}

const DeleteThreadModal: React.FC<DeleteThreadIF> = ({
  isOpen,
  threadId,
  toggle,
  setThreadId,
  tribeId,
}) => {
  const dispatch = useAppDispatch();
  const deleteThreadMutation = useDeleteThreadMutation(tribeId);

  const handleDeleteThread = () => {
    if (threadId !== null) {
      deleteThreadMutation.mutate(threadId);
    }
    dispatch(
      updateToastifyReducer({
        show: true,
        message: "Thread deleted.",
        type: "success",
      }),
    );
    setThreadId(null);
    toggle();
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
        <div className="w-[380px] rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Delete thread</p>
            </div>
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-light-black text-[14px] font-normal">
              Are you sure you want to delete this thread?
            </p>

            <div className="flex gap-3">
              <Button
                className="h-11 w-full rounded-xl border bg-white py-3.5 shadow-none hover:bg-white"
                onClick={handleDeleteThread}
              >
                <p className="font-semi-normal text-red-1 text-[16px]">Yes, delete</p>
              </Button>
              <Button
                className="bg-gradient-green h-11 w-full rounded-xl border-none bg-transparent shadow-none"
                onClick={toggle}
              >
                <p className="font-semi-normal text-[16px]">No, don&apos;t delete</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};
export default DeleteThreadModal;
