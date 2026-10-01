"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useDeleteBusinessMutation } from "@/features/businesses/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface DeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

function DeleteModal({ isOpen, toggle, id }: DeleteModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const deleteBusinessMutation = useDeleteBusinessMutation(id);

  const submitAction = () => {
    if (!isLoggedIn) return;
    deleteBusinessMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({ show: true, message: "Business deleted", type: "success" }),
        );
        toggle();
        router.push("/businesses");
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
        <DialogTitle className="sr-only">Delete business</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Delete business</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to delete this listing? This cannot be undone from here.
            </p>
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={"border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border text-center"}
                onClick={submitAction}
              >
                <p className={"text-[16px] font-medium text-white"}>Delete</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DeleteModal;
