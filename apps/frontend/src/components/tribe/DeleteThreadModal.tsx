import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useDeleteThreadMutation } from "@/features/tribes/mutations";

interface DeleteThreadIF {
  toggle: () => void;
  isOpen: boolean;
  threadId: string | null;
  setThreadId: (threadId: string | null) => void;
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
    if (threadId === null) return;
    deleteThreadMutation.mutate(threadId, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Thread deleted.",
            type: "success",
          }),
        );
        setThreadId(null);
        toggle();
      },
      onError: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Could not delete thread.",
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
        <div className="w-95 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-body-xl font-sans font-semibold">Delete thread</p>
            </div>
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to delete this thread?
            </p>

            <div className="flex gap-3">
              <Button
                className="h-11 w-full rounded-xl border bg-white py-3.5 shadow-none hover:bg-white"
                onClick={handleDeleteThread}
                loading={deleteThreadMutation.isPending}
              >
                <p className="font-semi-normal text-red-1 text-body-l">Yes, delete</p>
              </Button>
              <Button
                className="bg-gradient-green h-11 w-full rounded-xl border-none bg-transparent shadow-none"
                onClick={toggle}
              >
                <p className="font-semi-normal text-body-l">No, don&apos;t delete</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};
export default DeleteThreadModal;
