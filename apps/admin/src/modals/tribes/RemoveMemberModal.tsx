import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRemoveTribeMemberMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface RemoveMemberModalProps {
  isOpen: boolean;
  toggle: () => void;
  tribeId: string;
  userId?: string;
  memberName?: string;
}

function RemoveMemberModal({
  isOpen,
  toggle,
  tribeId,
  userId,
  memberName,
}: RemoveMemberModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const removeMemberMutation = useRemoveTribeMemberMutation(tribeId);

  const submitAction = () => {
    if (!userId) return;
    removeMemberMutation.mutate(userId, {
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
        <DialogTitle className="sr-only">Remove member</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Remove member</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to remove {memberName ?? "this member"} from the tribe?
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
                disabled={removeMemberMutation.isPending}
              >
                <p className={"text-[16px] font-medium text-white"}>
                  {removeMemberMutation.isPending ? "Removing..." : "Remove"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default RemoveMemberModal;
