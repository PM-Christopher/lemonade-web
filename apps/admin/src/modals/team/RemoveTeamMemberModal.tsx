"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useRemoveTeamMemberMutation } from "@/features/team/mutations";

interface RemoveTeamMemberModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
  // Runs after the member is removed, e.g. to leave their page.
  onRemoved: () => void;
}

function RemoveTeamMemberModal({ isOpen, toggle, id, onRemoved }: RemoveTeamMemberModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const removeMutation = useRemoveTeamMemberMutation(id);

  const remove = () => {
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Team member removed"),
            type: "success",
          }),
        );
        toggle();
        onRemoved();
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
        <DialogTitle className="sr-only">Remove member</DialogTitle>
        <div className="w-90 max-w-[92vw] rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Remove member</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to remove this team member?
            </p>
            <div className="flex justify-between gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className="border-red-2 bg-red-1 h-12 w-39 rounded-xl border text-center disabled:opacity-60"
                onClick={remove}
                disabled={removeMutation.isPending}
              >
                <p className="text-body-l font-medium text-white">Remove</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default RemoveTeamMemberModal;
