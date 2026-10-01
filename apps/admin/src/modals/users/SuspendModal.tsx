import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSuspendUserMutation } from "@/features/user/mutations";
import { FaSpinner } from "react-icons/fa6";

interface SuspendModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string | number;
  reload?: () => void;
}

function SuspendModal({ isOpen, toggle, id, reload }: SuspendModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("policy-violation");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const suspendUserMutation = useSuspendUserMutation(id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const SubmitAction = () => {
    if (isLoggedIn && id) {
      suspendUserMutation.mutate(undefined, {
        onSuccess: () => {
          toggle();
          reload?.();
        },
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Suspend user</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Suspend user</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to suspend this user? They will no longer have access to their
              account and other account activities.
            </p>
            <p className={"text-text-grey text-[14px] font-normal"}>Reason</p>
            <select
              className="bg-light-grey rounded-xl p-3"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value={"policy-violation"}>Policy violation</option>
              <option value={"inappropriate-behaviour"}>Inappropriate behaviour</option>
            </select>
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white py-3.5"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={"border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border py-3.5"}
                onClick={SubmitAction}
              >
                {suspendUserMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner size={20} className="animate-spin text-white" />
                  </div>
                ) : (
                  <p className={"text-[16px] font-medium text-white"}>Suspend</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SuspendModal;
