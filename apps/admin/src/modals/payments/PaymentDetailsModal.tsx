"use client";
import React from "react";
import dayjs from "dayjs";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { usePaymentDetailsQuery } from "@/features/payments/queries";
import { capitalizeWords } from "@/utils/helper";
import { naira } from "@/views/transactions/transactionFormat";

interface PaymentDetailsModalProps {
  id: string | null;
  onClose: () => void;
}

const when = (value: string | null | undefined) =>
  value ? dayjs(value).format("DD MMM, YYYY hh:mm:ss A") : "N/A";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2">
      <p className="text-text-grey text-body-s shrink-0">{label}</p>
      <div className="text-body-s text-right font-medium break-words">{children}</div>
    </div>
  );
}

// Everything about one payment: who paid, what for, the gateway's reply and where the money went.
function PaymentDetailsModal({ id, onClose }: PaymentDetailsModalProps) {
  const { data, isLoading, isError } = usePaymentDetailsQuery(id);
  const payment = data?.payment;

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Payment details</DialogTitle>
        <div className="hide-scrollbar flex max-h-[85vh] w-150 max-w-[95vw] flex-col overflow-y-auto rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">Payment details</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
              <XIcon />
            </button>
          </div>

          {isLoading && <p className="text-text-grey text-body-s mt-6">Loading...</p>}
          {isError && (
            <p className="text-body-s mt-6 text-red-600">Couldn&apos;t load this payment.</p>
          )}

          {payment && (
            <div className="mt-4 flex flex-col gap-5">
              <div className="bg-light_grey rounded-xl p-4 text-center">
                <p className="text-title-l font-semibold">{naira(payment.amount)}</p>
                <p className="text-text-grey text-body-s mt-1">
                  {capitalizeWords(payment.status)} ·{" "}
                  {capitalizeWords(payment.type.replace(/_/g, " "))}
                </p>
              </div>

              <div className="divide-y">
                <Row label="Reference">
                  <span className="font-mono text-xs">{payment.reference}</span>
                </Row>
                <Row label="For">{payment.for ?? "N/A"}</Row>
                <Row label="Paid by">
                  {payment.user ? (
                    <>
                      {payment.user.name}
                      <span className="text-text-grey block font-normal">{payment.user.email}</span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </Row>
                <Row label="Started">{when(payment.created_at)}</Row>
                <Row label="Paid at">{when(payment.paid_at)}</Row>
                {payment.settled_at && (
                  <Row label="Completed by an admin">
                    {payment.settled_by?.name ?? "An admin"}, {when(payment.settled_at)}
                  </Row>
                )}
                {payment.refunded_at && (
                  <Row label="Refunded">
                    {when(payment.refunded_at)}
                    {payment.refund_reference && (
                      <span className="block font-mono text-xs">{payment.refund_reference}</span>
                    )}
                  </Row>
                )}
              </div>

              <div>
                <p className="text-body-s font-semibold">Gateway</p>
                <div className="divide-y">
                  <Row label="Provider">{capitalizeWords(payment.provider)}</Row>
                  <Row label="Channel">
                    {payment.channel ? capitalizeWords(payment.channel) : "N/A"}
                  </Row>
                  <Row label="Status">{payment.gateway.status ?? "N/A"}</Row>
                  <Row label="Reply">{payment.gateway.message ?? "N/A"}</Row>
                  <Row label="Transaction id">{payment.gateway.transaction_id ?? "N/A"}</Row>
                  <Row label="IP address">{payment.gateway.ip_address ?? "N/A"}</Row>
                </div>
              </div>

              <div>
                <p className="text-body-s font-semibold">Where the money went</p>
                {payment.ledger.length > 0 ? (
                  <ul className="divide-y">
                    {payment.ledger.map((entry, index) => (
                      <li key={index} className="flex items-start justify-between gap-6 py-2">
                        <div>
                          <p className="text-body-s font-medium">
                            {capitalizeWords(entry.account.replace(/_/g, " "))}{" "}
                            <span className="text-text-grey font-normal">{entry.direction}</span>
                          </p>
                          {entry.description && (
                            <p className="text-text-grey text-meta">{entry.description}</p>
                          )}
                        </div>
                        <p className="text-body-s font-medium">{naira(entry.amount)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-grey text-body-s mt-2">
                    No money has moved for this payment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default PaymentDetailsModal;
