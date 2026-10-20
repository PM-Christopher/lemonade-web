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
import { useBoostTransactionQuery } from "@/features/transaction/queries";

const LinkText = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-light-green">
    {children}
  </Link>
);

const date = (value: string | null | undefined) =>
  value ? dayjs(value).format("DD MMM, YYYY hh:mm A") : "N/A";

function BoostingDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useBoostTransactionQuery(isLoggedIn ? id : undefined);
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
                <LinkText href={routes.BUSINESS_DETAIL(transaction.business.id)}>
                  View business
                </LinkText>
              ) : null}
            </div>
          ),
        },
        {
          label: "Business Owner",
          value: (
            <div className="flex items-center gap-3">
              <AvatarName name={transaction?.owner?.name} image={transaction?.owner?.image} />
              {transaction?.owner ? (
                <LinkText href={routes.USER_DETAIL(transaction.owner.id)}>View profile</LinkText>
              ) : null}
            </div>
          ),
        },
        { label: "Transaction Id", value: transaction?.txn_id },
        { label: "Boost Type", value: transaction?.boost_type },
        {
          label: "Duration",
          value: transaction
            ? `${transaction.duration_days} ${transaction.duration_days === 1 ? "day" : "days"}`
            : "",
        },
        {
          label: "Amount",
          value: transaction ? naira(transaction.amount) : "",
        },
        { label: "Start Date", value: date(transaction?.start_date) },
        { label: "End Date", value: date(transaction?.end_date) },
        { label: "Transaction Date", value: date(transaction?.transaction_date) },
        { label: "Status", value: <span className={status.className}>{status.label}</span> },
      ]}
      historyTitle="Boosting history"
      printName="boosting_history"
      entries={(data?.history ?? []).map((entry, index) => ({
        key: `${entry.txn_id}-${index}`,
        title: `${entry.txn_id} - ${entry.label} ${naira(entry.amount)}`,
        date: date(entry.date),
        status: entry.status,
      }))}
    />
  );
}

export default BoostingDetailsClient;
