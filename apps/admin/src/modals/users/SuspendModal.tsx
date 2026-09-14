import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSuspendUserMutation } from "@/features/user/mutations";
import { FaSpinner } from "react-icons/fa6";

interface SuspendModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: number;
  reload?: any;
}

function SuspendModal({ isOpen, toggle, id, reload }: SuspendModalProps) {
  const [selectedOption, setSelectedOption] =
    useState<string>("policy-violation");
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
          reload();
        },
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="w-[360px] bg-white pt-[16px] pb-[4px] rounded-[12px]">
        <div className={"py-[4px] px-[16px]"}>
          <div className="flex justify-between items-center">
            <p className="font-sans font-semibold text-[18px] leading-[27px]">
              Suspend user
            </p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
        </div>
        <div className={"py-[16px] flex flex-col gap-[16px] px-[16px]"}>
          <p className={"text-[14px] font-normal text-light-black"}>
            Are you sure you want to suspend this user? They will no longer have
            access to their account and other account activities.
          </p>
          <p className={"font-normal text-[14px] text-text-grey"}>Reason</p>
          <select
            className="bg-light-grey p-[12px] rounded-[12px]"
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
                "h-[48px] border-[1px] border-light-grey-50 py-[14px] rounded-[12px] bg-white w-[156px]"
              }
              onClick={toggle}
            >
              <p className={"text-black text-[16px] font-medium"}>Cancel</p>
            </button>
            <button
              className={
                "h-[48px] border-[1px] bg-red-1 border-red-2 py-[14px] rounded-[12px] w-[156px]"
              }
              onClick={SubmitAction}
            >
              {suspendUserMutation.isPending ? (
                <div className="flex justify-center items-center">
                  <FaSpinner size={20} className="animate-spin text-white" />
                </div>
              ) : (
                <p className={"text-[16px] font-medium text-white"}>Suspend</p>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuspendModal;
