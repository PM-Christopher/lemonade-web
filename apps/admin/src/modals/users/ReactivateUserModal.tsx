"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useReactivateUserMutation } from "@/features/user/mutations";

interface ReactivateUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

function ReactivateUserModal({ isOpen, toggle, id }: ReactivateUserModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const mutation = useReactivateUserMutation(id);

  const submit = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("User reactivated"),
            type: "success",
          }),
        );
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
        <DialogTitle className="sr-only">Reactivate user</DialogTitle>
        <div className="w-90 max-w-[92vw] rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Reactivate user</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to reactivate this user? They will have access to their account.
            </p>
            <div className="flex justify-between gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className="border-step-color bg-gradient-green h-12 w-39 rounded-xl border text-center disabled:opacity-60"
                onClick={submit}
                disabled={mutation.isPending}
              >
                <p className="text-body-l font-medium text-white">Activate</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ReactivateUserModal;
