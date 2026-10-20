import React from "react";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface DisputeJobModalProps {
  isOpen: boolean;
  toggle: () => void;
  toggleSubmit: () => void;
  // The business owner disputes withheld payment; the client disputes the service.
  isOwner: boolean;
}

const DisputeJobModal: React.FC<DisputeJobModalProps> = ({
  isOpen,
  toggle,
  toggleSubmit,
  isOwner,
}) => {
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
        <div className="laptop:w-120 w-full max-w-120 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-title-l font-sans leading-normal font-bold">Important</p>
          </div>
          <div className="mt-2 flex flex-col items-center">
            <div className={"flex flex-col gap-4"}>
              <p className="text-body-s font-normal">
                {isOwner
                  ? "It's best to avoid disputing services unless the client withholds payment after successful job completion."
                  : "It's best to avoid disputing services unless the business owner has breached the terms of your agreement."}
              </p>

              <p className={"text-body-s font-normal"}>To ensure your dispute is valid</p>

              <ol className="text-body-s list-decimal space-y-4 pl-5 font-sans font-normal">
                <li>Briefly explain the issue and how the agreement was breached.</li>
                <li>Upload clear photos as evidence.</li>
                <li>We&apos;ll analyze your claim to determine a fair resolution.</li>
              </ol>
            </div>
            <div className="mt-4 flex w-full justify-center gap-3">
              <Button
                className="bg-gradient-green h-12 w-full rounded-xl p-3.5 px-12"
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
