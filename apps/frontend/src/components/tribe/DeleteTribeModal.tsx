"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { useDeleteTribeMutation } from "@/features/tribes/mutations";

interface DeleteTribeModalProps {
  isOpen: boolean;
  toggle: () => void;
  tribeId: string;
  tribeSlug: string;
  // Paid tribes need an admin to approve the deletion.
  isPaid: boolean;
}

// Deletes a free tribe, or asks an admin to approve deleting a paid one.
const DeleteTribeModal: React.FC<DeleteTribeModalProps> = ({
  isOpen,
  toggle,
  tribeId,
  tribeSlug,
  isPaid,
}) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const deleteMutation = useDeleteTribeMutation(tribeSlug);

  const confirm = () =>
    deleteMutation.mutate(
      { id: tribeId },
      {
        onSuccess: (result) => {
          dispatch(updateToastifyReducer({ show: true, message: result.message, type: "success" }));
          toggle();
          if (result.status === "deleted") push(routes.TRIBE);
        },
        onError: (error) =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Could not delete tribe"),
              type: "error",
            }),
          ),
      },
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Delete tribe</DialogTitle>
        <div className="w-95 max-w-[92vw] rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">Delete tribe</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-light-black text-body-s font-normal">
              {isPaid
                ? "This is a paid tribe, so an admin has to approve its deletion first. The tribe stays active until then. Send the request?"
                : "Are you sure you want to delete this tribe? All its threads and members will be removed."}
            </p>
            <div className="flex gap-3">
              <Button
                className="h-11 w-full rounded-xl border bg-white py-3.5 shadow-none hover:bg-white"
                onClick={confirm}
                loading={deleteMutation.isPending}
              >
                <p className="font-semi-normal text-red-1 text-body-l">
                  {isPaid ? "Send request" : "Yes, delete"}
                </p>
              </Button>
              <Button
                className="bg-gradient-green hover:bg-gradient-green h-11 w-full rounded-xl border-none shadow-none"
                onClick={toggle}
              >
                <p className="font-semi-normal text-body-l">Cancel</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default DeleteTribeModal;
