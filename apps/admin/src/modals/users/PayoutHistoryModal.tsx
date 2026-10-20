"use client";
import React from "react";
import dayjs from "dayjs";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePayoutHistoryQuery } from "@/features/user/queries";
import { GetStatusClass, capitalizeWords, manualTransactionsExport } from "@/utils/helper";

interface PayoutHistoryModalProps {
  isOpen: boolean;
  toggle: () => void;
  userId: string | undefined;
}

// A user's payout requests and how each one went.
function PayoutHistoryModal({ isOpen, toggle, userId }: PayoutHistoryModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = usePayoutHistoryQuery(userId, { enabled: isLoggedIn && isOpen });
  const history = data?.payout_history ?? [];

  const print = () =>
    manualTransactionsExport(
      history.map((item) => ({
        amount: item.amount,
        status: item.status,
        date: dayjs(item.date).format("D, MMM YYYY. hh:mmA"),
      })),
      "payout-history",
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Payout history</DialogTitle>
        <div className="flex max-h-[80vh] w-120 max-w-[94vw] flex-col rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">Payout history</p>
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
          <div className="mt-4 flex flex-col overflow-y-auto">
            {history.length > 0 ? (
              history.map((item, index) => (
                <div className="flex items-center justify-between py-3" key={index}>
                  <div className="flex flex-col">
                    <p className="text-body-s font-medium">
                      ₦
                      {Number(item.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-text-grey text-meta leading-normal font-normal">
                      {dayjs(item.date).format("D, MMM YYYY. hh:mmA")}
                    </p>
                  </div>
                  <p
                    className={`rounded-lg px-2 py-1 text-xs font-medium ${GetStatusClass(capitalizeWords(item.status))}`}
                  >
                    {capitalizeWords(item.status)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-text-grey text-body-s font-normal">
                {isLoading ? "Loading..." : "No payouts yet."}
              </p>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default PayoutHistoryModal;
