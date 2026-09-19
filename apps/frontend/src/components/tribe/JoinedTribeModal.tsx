import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type JoinTribeInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe: any;
};

const JoinedTribeModal: React.FC<JoinTribeInterface> = ({
  toggle,
  isOpen,
  tribe,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          Welcome to {tribe?.tribe_name}
        </DialogTitle>
        <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-[24px]">
            <div className="my-6 flex justify-center">
              <div className="flex w-[544px] flex-col items-center gap-[8px]">
                <p className={"text-[18px] font-semiBold"}>Welcome to</p>
                <p className="text-center font-ruso text-[24px] font-normal leading-[21px]">
                  {tribe?.tribe_name}
                </p>
              </div>
            </div>
            <div>
              <p className={"text-center"}>
                Your payment was successful! You now have full access to all the
                discussions and content within the Tribe.
              </p>
            </div>

            <div className="flex justify-center rounded-[12px] bg-light_grey">
              <div className="flex w-[544px] flex-col gap-[20px] p-4 py-[24px]">
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px]">
                    Access to in-depth content
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px]">
                    Gain valuable knowledge
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px]">
                    Connect with your community
                  </p>
                </div>
              </div>
            </div>
            <button
              className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
              onClick={toggle}
            >
              <p className="font-sans text-[16px] font-semi-normal text-white">
                View tribe
              </p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default JoinedTribeModal;
