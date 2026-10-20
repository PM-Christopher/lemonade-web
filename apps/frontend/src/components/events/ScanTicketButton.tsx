"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import ScanIcon from "@/images/icons/scanIcon.svg";
import { useScanTicketMutation } from "@/features/events/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import type { GuestListCardProps } from "@/interfaces/EventInterface";

// Off the initial bundle: the camera code is only needed once scanning starts.
const ScanTicketModal = dynamic(() => import("@/components/events/Modals/ScanTicketModal"), {
  ssr: false,
});

type ScanTicketButtonProps = {
  eventId: number;
  onGuest: (guest: GuestListCardProps) => void;
};

// Scan button that finds a guest from their ticket QR code.
const ScanTicketButton: React.FC<ScanTicketButtonProps> = ({ eventId, onGuest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const scanTicketMutation = useScanTicketMutation(eventId);

  const handleScan = (code: string) => {
    scanTicketMutation.mutate(code, {
      onSuccess: ({ guest_details: guest }) => {
        setIsOpen(false);
        onGuest({
          id: guest.id,
          name: guest.user?.name ?? "",
          type: "",
          ticket_name: guest.ticket?.ticket_name ?? "",
          status: "",
          checked_in: Boolean(guest.checked_in),
        });
      },
      onError: (error) => {
        setIsOpen(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "We couldn't read that ticket."),
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Scan ticket"
        onClick={() => setIsOpen(true)}
        className="bg-light_grey flex cursor-pointer items-center justify-center rounded-xl p-3 transition-all duration-200 hover:bg-gray-200"
      >
        <ScanIcon className="h-5 w-5 text-gray-700" />
      </button>
      {isOpen && (
        <ScanTicketModal isOpen={isOpen} toggle={() => setIsOpen(false)} onScan={handleScan} />
      )}
    </>
  );
};

export default ScanTicketButton;
