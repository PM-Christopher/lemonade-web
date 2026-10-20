"use client";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AvatarName } from "@/components/global/AvatarName";
import { TransactionDetailLayout } from "@/components/transactions/TransactionDetailLayout";
import { routes } from "@/lib/routes";
import { naira } from "@/views/transactions/transactionFormat";
import { transactionStatus } from "@/utils/helper";
import { useServiceTransactionQuery } from "@/features/transaction/queries";

const date = (value: string | null | undefined) =>
  value ? dayjs(value).format("DD MMM, YYYY hh:mm A") : "N/A";

function ServiceDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useServiceTransactionQuery(isLoggedIn ? id : undefined);
  const transaction = data?.transaction;
  const status = transactionStatus(transaction?.status);

  return (
    <TransactionDetailLayout
      rows={[
        {
          label: "Business Name",
          value: (
            <div className="flex items-center gap-3">
              <AvatarName name={transaction?.business.name} image={transaction?.business.image} />
              {transaction ? (
                <Link
                  href={routes.BUSINESS_DETAIL(transaction.business.id)}
                  className="text-light-green"
                >
                  View business
                </Link>
              ) : null}
            </div>
          ),
        },
        { label: "Client Name", value: transaction?.client?.name ?? "N/A" },
        { label: "Transaction Id", value: transaction?.txn_id },
        {
          label: "Amount",
          value: transaction ? naira(transaction.amount) : "",
        },
        { label: "Transaction Type", value: transaction?.transaction_type },
        { label: "Date Paid", value: date(transaction?.date_paid) },
        { label: "Status", value: <span className={status.className}>{status.label}</span> },
      ]}
      historyTitle="Payment history"
      printName="service_payment_history"
      entries={(data?.history ?? []).map((entry, index) => ({
        key: `${entry.txn_id}-${index}`,
        title: `${entry.txn_id} - ${entry.label} ${naira(entry.amount)}`,
        date: date(entry.date),
        status: entry.status,
      }))}
    />
  );
}

export default ServiceDetailsClient;
