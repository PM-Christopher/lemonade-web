import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@/components/ui/button";

interface DisputeJobModalProps {
  isOpen: boolean;
  toggle: () => void;
  job: any;
  toggleSubmit: () => void;
}

const DisputeJobModal: React.FC<DisputeJobModalProps> = ({ isOpen, toggle, job, toggleSubmit }) => {
  const toggleModal = () => {
    toggle();
    toggleSubmit();
  };
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[24px] font-bold">Important</p>
        </div>
        <div className="mt-2 flex flex-col items-center">
          <div className={"flex flex-col gap-[16px]"}>
            <p className="text-[14px] font-normal">
              It&apos;s best to avoid disputing services unless the business owner has breached the
              terms of your agreement.
            </p>

            <p className={"text-[14px] font-normal"}>To ensure your dispute is valid</p>

            <ol className="list-decimal space-y-[16px] pl-5 font-sans text-[14px] font-normal">
              <li>Briefly explain the issue and how the agreement was breached.</li>
              <li>Upload clear photos as evidence.</li>
              <li>We&apos;ll analyze your claim to determine a fair resolution.</li>
            </ol>
          </div>
          <div className="mt-[16px] flex w-full justify-center gap-3">
            <Button
              className="h-[48px] w-full rounded-[12px] bg-gradient-green p-[14px] px-[48px] shadow-custom-bottom"
              onClick={toggleModal}
            >
              I understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeJobModal;
