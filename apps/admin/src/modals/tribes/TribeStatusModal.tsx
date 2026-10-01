import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useReactivateTribeMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface TribeStatusModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string;
}

// Confirms reactivating a restricted tribe. Named TribeStatusModal (an
// existing stub file) rather than "ReactivateTribeModal" since it's the
// counterpart to RestrictTribeModal/DeleteTribeModal's flag-tribe actions.
function TribeStatusModal({ isOpen, toggle, id }: TribeStatusModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reactivateTribeMutation = useReactivateTribeMutation(id);

  const submitAction = () => {
    if (!id) return;
    reactivateTribeMutation.mutate(undefined, {
      onSuccess: () => {
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
        <DialogTitle className="sr-only">Reactivate tribe</DialogTitle>
        <div className="w-[360px] rounded-[12px] bg-white pt-[16px] pb-[4px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Reactivate tribe</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to reactivate this tribe? It will be visible and joinable again.
            </p>
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={
                  "border-light-grey-50 h-[48px] w-[156px] rounded-[12px] border-[1px] bg-white"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "bg-gradient-green h-[48px] w-[156px] rounded-[12px] border-[1px] text-center"
                }
                onClick={submitAction}
                disabled={reactivateTribeMutation.isPending}
              >
                <p className={"text-[16px] font-medium text-white"}>
                  {reactivateTribeMutation.isPending ? "Reactivating..." : "Reactivate"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default TribeStatusModal;
