import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import StrikeLine from "@/images/icons/strikeLine.svg";
import CopyIcon from "@/images/icons/copyIcon.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type AffiliateLinkInterface = {
  isOpen: boolean;
  toggle: () => void;
  item: string;
};

const AffiliateLinkModal: React.FC<AffiliateLinkInterface> = ({ isOpen, toggle, item }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Link generated!"}</DialogTitle>
        {/* Centering wrapper with top/bottom padding */}
        <div className="relative flex w-[480px] items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
          {/* Modal */}
          <div
            className="animate-in fade-in zoom-in-95 relative max-h-[calc(100vh-48px)] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100vh-80px)] sm:max-w-[520px] sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700" />

              <button
                type="button"
                onClick={toggle}
                className="rounded-full p-2 transition hover:bg-gray-100 active:bg-gray-200"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="mt-3 sm:mt-6">
              <div className="flex justify-center">
                <div className="relative h-[160px] w-[160px] sm:h-[200px] sm:w-[200px]">
                  <Image
                    src="/images/affliliateLink.png"
                    alt="affiliate-link"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[18px] font-semibold sm:text-[20px]">Link generated!</p>
                <p className="text-text-grey mt-2 text-[14px] sm:text-[16px]">
                  You have successfully joined this affiliate program. Share your link and start
                  earning now.
                </p>
              </div>

              <div className="bg-light-tint mt-6 mb-2 rounded-2xl p-4">
                <p className="font-semi-normal text-text-grey text-[13px] sm:text-[14px]">
                  Affiliate link
                </p>

                <div className="bg-light-tint-3 mt-2 flex items-center gap-2 rounded-2xl p-3">
                  <p className="font-semi-normal text-light-black min-w-0 flex-1 truncate">
                    {process.env.NEXT_PUBLIC_BASE_URL + "/" + item}
                  </p>

                  <div className="flex shrink-0 items-center gap-2">
                    <StrikeLine />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(item)}
                      className="rounded-xl p-2 transition hover:bg-black/5 active:bg-black/10"
                      aria-label="Copy affiliate link"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggle}
                className="hover:bg-light-green-20 bg-light-green-10 font-semi-normal text-light-green mt-4 w-full rounded-2xl py-3 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default AffiliateLinkModal;
