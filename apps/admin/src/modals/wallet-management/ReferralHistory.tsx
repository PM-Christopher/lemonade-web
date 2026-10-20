import React from "react";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useReferralHistoryQuery } from "@/features/user/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { manualTransactionsExport } from "@/utils/helper";

type ReferralHistoryInterface = {
  isOpen: boolean;
  toggle: () => void;
  // The referrer whose history to show.
  affiliateId: string;
};

const ReferralHistory: React.FC<ReferralHistoryInterface> = ({ isOpen, toggle, affiliateId }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useReferralHistoryQuery(affiliateId, {
    enabled: isLoggedIn && isOpen,
  });
  const history = data?.referral_history ?? [];

  const print = () =>
    manualTransactionsExport(
      history.map((item) => ({
        amount: item.amount,
        type: item.type,
        date: dayjs(item.created_at).format("D, MMM YYYY. hh:mmA"),
      })),
      "referral-history",
    );

  if (!isOpen) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="fixed top-5 right-5 bottom-5 left-auto w-fit max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Referral history</DialogTitle>
        <div className="flex h-full flex-col rounded-xl bg-white" style={{ width: "585px" }}>
          <div
            className="flex items-center justify-between"
            style={{
              paddingTop: "24px",
              paddingBottom: "8px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <div>
              <p className="tracking-custom text-body-l font-sans font-semibold">
                Referral history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2"
                onClick={print}
                disabled={history.length === 0}
              >
                <PrinterIcon className="w-4" />
                <span className="text-body-s font-medium">Print</span>
              </button>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className={"mt-4 flex flex-col px-6"}>
            {history.map((item, index: number) => (
              <div className={"flex justify-between px-4 pt-4 pb-6"} key={index}>
                <div className={"flex flex-col"}>
                  <p className={"text-body-s font-medium"}>
                    ₦{formatNumberWithCommas(Number(item.amount))} - {item.type}
                  </p>
                  <p className={"text-text-grey text-meta leading-normal font-normal"}>
                    {dayjs(item.created_at).format("D, MMM YYYY. hh:mmA")}
                  </p>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-text-grey text-body-s px-4 font-normal">
                {isLoading ? "Loading..." : "No referral payments yet."}
              </p>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ReferralHistory;
