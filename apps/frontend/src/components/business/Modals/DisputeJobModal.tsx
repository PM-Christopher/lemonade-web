import React from "react";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface DisputeJobModalProps {
  isOpen: boolean;
  toggle: () => void;
  job: Record<string, unknown>;
  toggleSubmit: () => void;
}

const DisputeJobModal: React.FC<DisputeJobModalProps> = ({ isOpen, toggle, toggleSubmit }) => {
  const toggleModal = () => {
    toggle();
    toggleSubmit();
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Important"}</DialogTitle>
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[24px] font-bold">Important</p>
          </div>
          <div className="mt-2 flex flex-col items-center">
            <div className={"flex flex-col gap-4"}>
              <p className="text-[14px] font-normal">
                It&apos;s best to avoid disputing services unless the business owner has breached
                the terms of your agreement.
              </p>

              <p className={"text-[14px] font-normal"}>To ensure your dispute is valid</p>

              <ol className="list-decimal space-y-4 pl-5 font-sans text-[14px] font-normal">
                <li>Briefly explain the issue and how the agreement was breached.</li>
                <li>Upload clear photos as evidence.</li>
                <li>We&apos;ll analyze your claim to determine a fair resolution.</li>
              </ol>
            </div>
            <div className="mt-4 flex w-full justify-center gap-3">
              <Button
                className="bg-gradient-green shadow-custom-bottom h-12 w-full rounded-xl p-3.5 px-12"
                onClick={toggleModal}
              >
                I understand
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default DisputeJobModal;
