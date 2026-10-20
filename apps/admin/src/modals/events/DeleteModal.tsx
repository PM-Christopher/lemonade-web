import React, { useState } from "react";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContentBare,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useDeleteEventMutation } from "@/features/events/mutations";
import { errorMessage } from "@/lib/api-error";
import { ACTION_REASONS } from "@/modals/reasons";

interface DeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string | number;
}

// Deletes an event and records why.
function DeleteModal({ isOpen, toggle, id }: DeleteModalProps) {
  const [reason, setReason] = useState<string>(ACTION_REASONS[0]);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { push } = useNavigation();
  const deleteEventMutation = useDeleteEventMutation(id);

  const submit = () => {
    if (!isLoggedIn || !id) return;
    deleteEventMutation.mutate(reason, {
      onSuccess: () => {
        toggle();
        push(routes.EVENTS);
      },
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't delete this event."),
            type: "error",
          }),
        ),
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
        <DialogTitle className="sr-only">Delete event</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Delete event</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to suspend this event? It will no longer be listed and all
              ticket sales will be lost.
            </p>
            <p className="text-text-grey text-body-s font-normal">Reason</p>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger aria-label="Reason" className="bg-light-grey h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_REASONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className="border-red-2 bg-red-1 h-12 w-39 rounded-xl border text-center disabled:opacity-60"
                onClick={submit}
                disabled={deleteEventMutation.isPending}
              >
                <p className="text-body-l font-medium text-white">Delete</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DeleteModal;
