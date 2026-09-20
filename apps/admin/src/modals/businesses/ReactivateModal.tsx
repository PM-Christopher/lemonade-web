"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useReactivateBusinessMutation } from "@/features/businesses/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface ReactivateModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

function ReactivateModal({ isOpen, toggle, id }: ReactivateModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const reactivateBusinessMutation = useReactivateBusinessMutation(id);

  const submitAction = () => {
    if (!isLoggedIn) return;
    reactivateBusinessMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(updateToastifyReducer({ show: true, message: "Business reactivated", type: "success" }));
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
        <DialogTitle className="sr-only">Reactivate business</DialogTitle>
        <div className="w-[360px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] font-semibold leading-[27px]">Reactivate business</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-[14px] font-normal text-light-black"}>
              Are you sure you want to reactivate this listing? It will be visible on the platform again.
            </p>
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={"h-[48px] w-[156px] rounded-[12px] border-[1px] border-light-grey-50 bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "h-[48px] w-[156px] rounded-[12px] border-[1px] border-step-color bg-gradient-green text-center"
                }
                onClick={submitAction}
              >
                <p className={"text-[16px] font-medium text-white"}>Reactivate</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ReactivateModal;
