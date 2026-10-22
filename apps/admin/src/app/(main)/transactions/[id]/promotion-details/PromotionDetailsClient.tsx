"use client";
import React from "react";
import { images } from "@/lib/images";
import Link from "next/link";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AvatarName } from "@/components/global/AvatarName";
import { TransactionDetailLayout } from "@/components/transactions/TransactionDetailLayout";
import { routes } from "@/lib/routes";
import { naira } from "@/views/transactions/transactionFormat";
import { transactionStatus } from "@/utils/helper";
import { usePromotionTransactionQuery } from "@/features/transaction/queries";

const date = (value: string | null | undefined, withTime = true) =>
  value ? dayjs(value).format(withTime ? "DD MMM, YYYY hh:mm A" : "DD MMM, YYYY") : "N/A";

function PromotionDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = usePromotionTransactionQuery(isLoggedIn ? id : undefined);
  const transaction = data?.transaction;
  const status = transactionStatus(transaction?.status);

  return (
    <TransactionDetailLayout
      rows={[
        {
          label: "Event Name",
          value: (
            <AvatarName
              name={transaction?.event.name}
              image={transaction?.event.image}
              fallbackSrc={images.DEFAULT_EVENT}
            />
          ),
        },
        {
          label: "Event Owner",
          value: (
            <div className="flex items-center gap-3">
              <AvatarName name={transaction?.owner?.name} image={transaction?.owner?.image} />
              {transaction?.owner ? (
                <Link href={routes.USER_DETAIL(transaction.owner.id)} className="text-light-green">
                  View profile
                </Link>
              ) : null}
            </div>
          ),
        },
        { label: "Transaction Id", value: transaction?.txn_id },
        { label: "Promotion Name", value: transaction?.promotion_name ?? "N/A" },
        {
          label: "Amount",
          value: transaction ? naira(transaction.amount) : "",
        },
        { label: "Date Paid", value: date(transaction?.date_paid) },
        { label: "Promotion Date", value: date(transaction?.promotion_date, false) },
        { label: "Status", value: <span className={status.className}>{status.label}</span> },
      ]}
      historyTitle="Payment history"
      printName="promotion_payment_history"
      entries={(data?.history ?? []).map((entry, index) => ({
        key: `${entry.txn_id}-${index}`,
        title: `${entry.txn_id} - ${entry.label} ${naira(entry.amount)}`,
        date: date(entry.date),
        status: entry.status,
      }))}
    />
  );
}

export default PromotionDetailsClient;
