"use client";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AvatarName } from "@/components/global/AvatarName";
import { TransactionDetailLayout } from "@/components/transactions/TransactionDetailLayout";
import { useTransactionEventDetailQuery } from "@/features/transaction/queries";
import { routes } from "@/lib/routes";
import { transactionStatus } from "@/utils/helper";

const date = (value: unknown) =>
  typeof value === "string" ? dayjs(value).format("DD MMM, YYYY hh:mm A") : "N/A";

function TransactionEventDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: event } = useTransactionEventDetailQuery(id, { enabled: isLoggedIn });
  const info = event?.info;
  const status = transactionStatus(info?.status);
  const image = (info as { event_image?: string | null } | undefined)?.event_image;
  const amount = (info as { amount?: string } | undefined)?.amount;

  return (
    <TransactionDetailLayout
      rows={[
        { label: "Event Name", value: <AvatarName name={info?.event_name} image={image} /> },
        {
          label: "Event Owner",
          value: (
            <div className="flex items-center gap-3">
              <span>{info?.organizer}</span>
              {info?.user_id ? (
                <Link href={routes.USER_DETAIL(info.user_id)} className="text-light-green">
                  View profile
                </Link>
              ) : null}
            </div>
          ),
        },
        { label: "Transaction Id", value: info?.transaction_id },
        { label: "Amount", value: `₦${Number(amount ?? 0).toLocaleString()}` },
        { label: "Tickets Sold", value: info?.tickets_sold },
        { label: "Date Paid", value: date(info?.created_at) },
        { label: "Status", value: <span className={status.className}>{status.label}</span> },
      ]}
      historyTitle="Ticket sales"
      printName="event_ticket_sales"
      entries={(event?.history ?? []).map((item, index) => ({
        key: `${item.unique_id}-${index}`,
        title: `${item.unique_id} - ₦${Number(item.amount ?? 0).toLocaleString()}`,
        date: date(item.created_at),
        status: String(item.status ?? ""),
      }))}
    />
  );
}

export default TransactionEventDetailsClient;
