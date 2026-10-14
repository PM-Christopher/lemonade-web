import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@lemonade/ui";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  TicketQuoteBreakdown,
  type TicketQuoteState,
} from "@/components/events/TicketQuoteBreakdown";

// Mobile bottom sheet showing the server-priced ticket summary.
const TicketSummary = ({
  toggle,
  proceed,
  isOpen,
  totalLabel,
  quoteState,
}: {
  toggle: () => void;
  proceed: () => void;
  isOpen: boolean;
  totalLabel: string;
  quoteState: TicketQuoteState;
}) => {
  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-end justify-center bg-gray-800 ${isOpen ? "flex" : "hidden"}`}
    >
      <motion.div
        role="dialog"
        aria-label="Ticket summary"
        className="w-120 rounded-tl-lg rounded-tr-lg bg-white p-6 shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-body-l font-bold">Summary</p>
          <button
            type="button"
            aria-label="Close summary"
            className="cursor-pointer"
            onClick={toggle}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mt-6">
          <div className="flex flex-col gap-y-12.5 rounded-xl bg-white px-2.5 py-3">
            <TicketQuoteBreakdown {...quoteState} />
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center justify-center gap-4">
                <div className="flex w-36.75 items-center gap-4">
                  <p className="text-mid-green text-title-r leading-normal font-bold">
                    {totalLabel}
                  </p>
                  <button type="button" aria-label="Hide summary" onClick={toggle}>
                    <ChevronDown className="text-mid-green cursor-pointer" />
                  </button>
                </div>
                <Button
                  className="bg-gradient-green h-12 w-45 rounded-xl border-b-2 px-12 py-3.5 shadow-none"
                  onClick={proceed}
                >
                  <p className="font-semi-normal text-body-l">Assign ticket</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;
