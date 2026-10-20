import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import { useRemoveTribeMemberMutation } from "@/features/tribes/mutations";

export interface MemberToRemove {
  userId: string;
  username: string;
}

interface RemoveMemberModalProps {
  tribeSlug: string;
  member: MemberToRemove | null;
  onClose: () => void;
}

const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({ tribeSlug, member, onClose }) => {
  const dispatch = useAppDispatch();
  const removeMemberMutation = useRemoveTribeMemberMutation(tribeSlug);

  const handleRemove = () => {
    if (!member) return;
    removeMemberMutation.mutate(member.userId, {
      onSuccess: () => {
        dispatch(updateToastifyReducer({ show: true, message: "Member removed", type: "success" }));
        onClose();
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Could not remove member"),
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <Dialog
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Remove member</DialogTitle>
        <div className="w-95 max-w-[92vw] rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">Remove member</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-light-black text-body-s font-normal">
              Are you sure you want to remove {member ? `@${member.username}` : "this member"} from
              your tribe?
            </p>
            <div className="flex gap-3">
              <Button
                className="h-11 w-full rounded-xl border bg-white py-3.5 shadow-none hover:bg-white"
                onClick={handleRemove}
                loading={removeMemberMutation.isPending}
              >
                <p className="font-semi-normal text-red-1 text-body-l">Yes, remove</p>
              </Button>
              <Button
                className="bg-gradient-green hover:bg-gradient-green h-11 w-full rounded-xl border-none shadow-none"
                onClick={onClose}
              >
                <p className="font-semi-normal text-body-l">No, keep</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default RemoveMemberModal;
