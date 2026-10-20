"use client";
import React from "react";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUserTribeHistoryQuery } from "@/features/user/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { manualTransactionsExport } from "@/utils/helper";

interface TribeHistoryModalProps {
  isOpen: boolean;
  toggle: () => void;
  userId: string | undefined;
}

// What a tribe owner has earned from paid members.
function TribeHistoryModal({ isOpen, toggle, userId }: TribeHistoryModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useUserTribeHistoryQuery(userId, { enabled: isLoggedIn && isOpen });
  const history = data?.tribe_history ?? [];

  const print = () =>
    manualTransactionsExport(
      history.map((item) => ({
        amount: item.amount,
        member: item.member ?? "",
        tribe: item.tribe_name ?? "",
        date: item.created,
      })),
      "tribe-history",
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Tribe history</DialogTitle>
        <div className="flex max-h-[80vh] w-120 flex-col rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">Tribe history</p>
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
                <div className="flex flex-col py-3" key={index}>
                  <p className="text-body-s font-medium">
                    ₦{formatNumberWithCommas(Number(item.amount))}
                    {item.member ? ` - @${item.member}` : ""}
                    {item.tribe_name ? ` (${item.tribe_name})` : ""}
                  </p>
                  <p className="text-text-grey text-meta leading-normal font-normal">
                    {item.created}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-text-grey text-body-s font-normal">
                {isLoading ? "Loading..." : "No tribe earnings yet."}
              </p>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default TribeHistoryModal;
