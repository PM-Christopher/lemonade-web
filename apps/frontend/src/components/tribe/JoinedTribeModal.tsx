import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type JoinTribeInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe: any;
};

const JoinedTribeModal: React.FC<JoinTribeInterface> = ({ toggle, isOpen, tribe }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Welcome to {tribe?.tribe_name}</DialogTitle>
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
                <p className={"font-semiBold text-[18px]"}>Welcome to</p>
                <p className="font-ruso text-center text-[24px] leading-[21px] font-normal">
                  {tribe?.tribe_name}
                </p>
              </div>
            </div>
            <div>
              <p className={"text-center"}>
                Your payment was successful! You now have full access to all the discussions and
                content within the Tribe.
              </p>
            </div>

            <div className="bg-light_grey flex justify-center rounded-[12px]">
              <div className="flex w-[544px] flex-col gap-[20px] p-4 py-[24px]">
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Access to in-depth content
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Gain valuable knowledge
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal font-sans text-[14px] leading-[21px]">
                    Connect with your community
                  </p>
                </div>
              </div>
            </div>
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-[12px] p-[10px] px-[14px]"
              onClick={toggle}
            >
              <p className="font-semi-normal font-sans text-[16px] text-white">View tribe</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default JoinedTribeModal;
