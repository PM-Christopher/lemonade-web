"use client";
import React from "react";
import dayjs from "dayjs";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEventAffiliateSalesQuery } from "@/features/events/queries";
import { manualTransactionsExport } from "@/utils/helper";
import { naira } from "@/views/transactions/transactionFormat";

interface AffiliateSalesModalProps {
  isOpen: boolean;
  toggle: () => void;
  // The affiliate's id on the affiliates list.
  affiliateId: string;
}

// Every ticket sold through this affiliate's links.
function AffiliateSalesModal({ isOpen, toggle, affiliateId }: AffiliateSalesModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useEventAffiliateSalesQuery(affiliateId, {
    enabled: isLoggedIn && isOpen,
  });
  const sales = data?.sales ?? [];

  const print = () =>
    manualTransactionsExport(
      sales.map((sale) => ({
        event: sale.event_name ?? "",
        ticket: sale.ticket_name ?? "",
        buyer: sale.buyer_name ?? "",
        price: sale.price ?? "",
        date: dayjs(sale.sold_at).format("D, MMM YYYY. hh:mmA"),
      })),
      "affiliate-ticket-sales",
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Ticket sales</DialogTitle>
        <div className="flex max-h-[80vh] w-140 max-w-[94vw] flex-col rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">Ticket sales ({sales.length})</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2"
                onClick={print}
                disabled={sales.length === 0}
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
            {sales.length > 0 ? (
              sales.map((sale) => (
                <div className="flex items-center justify-between py-3" key={sale.id}>
                  <div className="flex min-w-0 flex-col">
                    <p className="text-body-s truncate font-medium">
                      {sale.ticket_name ?? "Ticket"} · {sale.event_name ?? "Event"}
                    </p>
                    <p className="text-text-grey text-meta leading-normal font-normal">
                      {sale.buyer_name ?? "Unknown buyer"} ·{" "}
                      {dayjs(sale.sold_at).format("D, MMM YYYY. hh:mmA")}
                    </p>
                  </div>
                  <p className="text-body-s shrink-0 font-medium">{naira(sale.price)}</p>
                </div>
              ))
            ) : (
              <p className="text-text-grey text-body-s font-normal">
                {isLoading ? "Loading..." : "No tickets sold through this affiliate yet."}
              </p>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default AffiliateSalesModal;
