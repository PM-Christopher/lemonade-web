"use client";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useDeactivateUserMutation, useSuspendUserMutation } from "@/features/user/mutations";

export type UserStatusAction = "suspend" | "deactivate";

interface UserStatusActionModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
  action: UserStatusAction;
}

const REASONS = ["Policy violation", "Inappropriate behavior"];

const COPY: Record<
  UserStatusAction,
  { title: string; body: string; button: string; done: string }
> = {
  suspend: {
    title: "Suspend user",
    body: "Are you sure you want to suspend this user? They will no longer have access to their account and other account activities.",
    button: "Suspend",
    done: "User suspended",
  },
  deactivate: {
    title: "Deactivate user",
    body: "Are you sure you want to deactivate this user? This user account and all activities related to it will be permanently removed on the platform",
    button: "Deactivate",
    done: "User deactivated",
  },
};

// Suspends or deactivates a user and records why.
function UserStatusActionModal({ isOpen, toggle, id, action }: UserStatusActionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [reason, setReason] = useState(REASONS[0]);
  const suspend = useSuspendUserMutation(id);
  const deactivate = useDeactivateUserMutation(id);
  const mutation = action === "suspend" ? suspend : deactivate;
  const copy = COPY[action];

  const submit = () => {
    mutation.mutate(reason, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({ show: true, message: apiMessage(copy.done), type: "success" }),
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
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <div className="w-90 max-w-[92vw] rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">{copy.title}</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">{copy.body}</p>
            <label htmlFor="status-reason" className="text-text-grey text-body-s font-normal">
              Reason
            </label>
            <select
              id="status-reason"
              className="bg-light-grey rounded-xl p-3"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="flex justify-between gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white py-3.5"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className="border-red-2 bg-red-1 h-12 w-39 rounded-xl border py-3.5 text-center disabled:opacity-60"
                onClick={submit}
                disabled={mutation.isPending}
              >
                <p className="text-body-l font-medium text-white">{copy.button}</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default UserStatusActionModal;
