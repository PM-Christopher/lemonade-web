import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSuspendEventMutation } from "@/features/events/mutations";

interface DeactivateModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: number;
}

function SuspendModal({ isOpen, toggle, id }: DeactivateModalProps) {
  const [selectedOption, setSelectedOption] =
    useState<string>("policy-violation");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const suspendEventMutation = useSuspendEventMutation(id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const SubmitAction = () => {
    if (isLoggedIn && id) {
      suspendEventMutation.mutate(undefined, {
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
        <DialogTitle className="sr-only">Suspend event</DialogTitle>
        <div className="w-[360px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] font-semibold leading-[27px]">
                Suspend event
              </p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-[14px] font-normal text-light-black"}>
              Are you sure you want to suspend this event? It will no longer be
              listed and all ticket sales will be lost.
            </p>
            <p className={"text-[14px] font-normal text-text-grey"}>Reason</p>
            <select
              className="rounded-[12px] bg-light-grey p-[12px]"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value={"policy-violation"}>Policy violation</option>
              <option value={"inappropriate-behaviour"}>
                Inappropriate behaviour
              </option>
            </select>
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={
                  "h-[48px] w-[156px] rounded-[12px] border-[1px] border-light-grey-50 bg-white"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "h-[48px] w-[156px] rounded-[12px] border-[1px] border-red-2 bg-red-1 text-center"
                }
                onClick={SubmitAction}
              >
                <p className={"text-[16px] font-medium text-white"}>Restrict</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SuspendModal;
