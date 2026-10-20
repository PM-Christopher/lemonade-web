import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import type { TribeInterface } from "@/interfaces/TribeInterface";

type JoinTribeInterface = {
  toggle: () => void;
  isOpen: boolean;
  tribe: TribeInterface | null;
};

const JoinedTribeModal: React.FC<JoinTribeInterface> = ({ toggle, isOpen, tribe }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="laptop:top-[50%] laptop:bottom-auto laptop:left-[50%] laptop:w-fit laptop:translate-x-[-50%] laptop:translate-y-[-50%] laptop:rounded-lg fixed top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-t-2xl rounded-b-none border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Welcome to {tribe?.tribe_name}</DialogTitle>
        <div className="laptop:w-160 laptop:rounded-lg w-full rounded-t-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="laptop:mt-10 mt-4 flex flex-col items-center gap-6">
            <div className="my-6 flex justify-center">
              <div className="laptop:w-136 flex w-full flex-col items-center gap-2">
                <p className={"font-semiBold text-body-xl"}>Welcome to</p>
                <p className="font-ruso text-title-l text-center leading-5.25 font-normal">
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

            <div className="bg-light_grey flex justify-center rounded-xl">
              <div className="laptop:w-136 flex w-full flex-col gap-5 p-4 py-6">
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">
                    Access to in-depth content
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">Gain valuable knowledge</p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckedIcon />
                  <p className="font-semi-normal text-body-s font-sans">
                    Connect with your community
                  </p>
                </div>
              </div>
            </div>
            <button
              className="auth-button border-step-color laptop:h-auto laptop:w-auto h-12 w-full rounded-xl p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal text-body-l font-sans text-white">View tribe</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default JoinedTribeModal;
