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

const AffiliateLinkModal: React.FC<AffiliateLinkInterface> = ({
  isOpen,
  toggle,
  item,
}) => {
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
        <div className="sm:px-6 sm:py-10 relative flex w-[480px] items-center justify-center px-4 py-6">
          {/* Modal */}
          <div
            className="sm:max-w-[520px] sm:p-6 sm:max-h-[calc(100vh-80px)] relative max-h-[calc(100vh-48px)] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95"
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
            <div className="sm:mt-6 mt-3">
              <div className="flex justify-center">
                <div className="sm:w-[200px] sm:h-[200px] relative h-[160px] w-[160px]">
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
                <p className="sm:text-[20px] text-[18px] font-semibold">
                  Link generated!
                </p>
                <p className="sm:text-[16px] mt-2 text-[14px] text-text-grey">
                  You have successfully joined this affiliate program. Share
                  your link and start earning now.
                </p>
              </div>

              <div className="mb-2 mt-6 rounded-2xl bg-light-tint p-4">
                <p className="sm:text-[14px] text-[13px] font-semi-normal text-text-grey">
                  Affiliate link
                </p>

                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-light-tint-3 p-3">
                  <p className="min-w-0 flex-1 truncate font-semi-normal text-light-black">
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
                className="hover:bg-light-green-20 mt-4 w-full rounded-2xl bg-light-green-10 py-3 font-semi-normal text-light-green transition"
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
