"use client";
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
import { ACTION_REASONS } from "@/modals/reasons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSuspendBusinessMutation } from "@/features/businesses/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

interface SuspendModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

function SuspendModal({ isOpen, toggle, id }: SuspendModalProps) {
  const [reason, setReason] = useState<string>(ACTION_REASONS[0]);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const suspendBusinessMutation = useSuspendBusinessMutation(id);

  const submitAction = () => {
    if (!isLoggedIn) return;
    suspendBusinessMutation.mutate(
      { reason },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Business restricted"),
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
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Restrict business</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Restrict business</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-body-s font-normal"}>
              Are you sure you want to restrict this business? It will no longer be listed and all
              pending services will be lost.
            </p>
            <p className={"text-text-grey text-body-s font-normal"}>Reason</p>
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
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-body-l font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "border-red-2 bg-red-1 h-12 w-39 rounded-xl border text-center disabled:opacity-50"
                }
                onClick={submitAction}
                disabled={suspendBusinessMutation.isPending}
              >
                <p className={"text-body-l font-medium text-white"}>Restrict</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SuspendModal;
