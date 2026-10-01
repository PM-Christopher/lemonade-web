import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type PayoutInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const PayoutModal: React.FC<PayoutInterface> = ({ isOpen, toggle }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Payout requested</DialogTitle>
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="flex flex-col items-center">
              <div>
                <Image src={"/images/Payout.png"} alt="payout" width={311} height={160} />
              </div>
              <div className="mt-6">
                <p className="text-center text-[20px] font-semibold">Payout requested</p>
                <p className="max-w-[416px] text-center text-[16px] font-normal">
                  Your payment is being processed and will be disbursed into the account details
                  provided below
                </p>
              </div>
              <div className="bg-light-tint mt-6 w-full rounded-xl p-4">
                <div className="bg-light-tint-3 rounded-xl p-2">
                  <p className="text-text-grey text-center text-[12px] font-normal">
                    Payout amount
                  </p>
                  <p className="text-black-light text-center text-[20px] font-semibold">N2,000</p>
                </div>
                <div className="my-4 flex justify-between">
                  <p className="text-[14px] font-normal">Account name</p>
                  <p className="font-semi-normal text-[14px]">Christine Joseph</p>
                </div>
                <div className="my-4 flex justify-between">
                  <p className="text-[14px] font-normal">Bank name</p>
                  <p className="font-semi-normal text-[14px]">United Bank for Africa</p>
                </div>
                <div className="my-4 flex justify-between">
                  <p className="text-[14px] font-normal">Account number</p>
                  <p className="font-semi-normal text-[14px]">0823212345</p>
                </div>
              </div>

              <Button className="border-step-color bg-gradient-green shadow-custom-bottom mt-12 h-12 w-full rounded-xl p-3.5 px-12">
                <p>Done</p>
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PayoutModal;
