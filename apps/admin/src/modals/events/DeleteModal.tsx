import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDeleteEventMutation } from "@/features/events/mutations";

interface DeactivateModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string | number;
}

function DeleteModal({ isOpen, toggle, id }: DeactivateModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("policy-violation");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const deleteEventMutation = useDeleteEventMutation(id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const SubmitAction = () => {
    if (isLoggedIn && id) {
      deleteEventMutation.mutate(undefined, {
        onSuccess: () => {
          toggle();
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
        <DialogTitle className="sr-only">Delete event</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Delete event</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to delete this event? All ticket sales will be lost forever.
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
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={"border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border text-center"}
                onClick={SubmitAction}
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
