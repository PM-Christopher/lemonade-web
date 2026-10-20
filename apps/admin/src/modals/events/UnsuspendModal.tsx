import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useActivateEventMutation } from "@/features/events/mutations";
import { errorMessage } from "@/lib/api-error";

interface UnsuspendModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

// Confirms putting a suspended event back on the platform.
function UnsuspendModal({ isOpen, toggle, id }: UnsuspendModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const activateEventMutation = useActivateEventMutation(id);

  const confirm = () =>
    activateEventMutation.mutate(undefined, {
      onSuccess: toggle,
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't reactivate this event."),
            type: "error",
          }),
        ),
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Unsuspend event</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Unsuspend event</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to reactivate this event? It will be re-listed.
            </p>
            <div className="flex justify-between gap-2.5">
              <button
                type="button"
                className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                type="button"
                className="bg-gradient-green h-12 w-39 rounded-xl border text-center disabled:opacity-60"
                onClick={confirm}
                disabled={activateEventMutation.isPending}
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

export default UnsuspendModal;
