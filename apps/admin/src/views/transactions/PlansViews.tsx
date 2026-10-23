import React from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import DataCard from "@/components/global/DataCard";
import { AvatarName } from "@/components/global/AvatarName";
import { TransactionTable, type TransactionColumn } from "@/components/global/TransactionTable";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { transactionStatus } from "@/utils/helper";
import type { TransactionHistoryRow, TransactionListResponse } from "@/features/transaction/api";
import { naira } from "./transactionFormat";

interface ViewProps {
  trx_data: TransactionListResponse | undefined;
  page: number;
  onPageChange: (page: number) => void;
}

const Status = ({ value }: { value: string | undefined }) => {
  const status = transactionStatus(value);
  return <span className={status.className}>{status.label}</span>;
};

const columns: ReadonlyArray<TransactionColumn<TransactionHistoryRow>> = [
  { header: "TXN ID", cell: (row) => row.txn_id },
  {
    header: "FULL NAME",
    cell: (row) => (
      <AvatarName name={row.fullname} image={row.image as string | null | undefined} />
    ),
  },
  { header: "ACCOUNT PLAN", cell: (row) => row.plan },
  { header: "AMOUNT", cell: (row) => naira(row.amount) },
  { header: "DATE PAID", cell: (row) => row.date_paid ?? row.created_at },
  { header: "STATUS", cell: (row) => <Status value={row.status} /> },
];

// Server-paginated: trx_data.history is only the current page.
function PlansViews({ trx_data, page, onPageChange }: ViewProps) {
  const { push } = useNavigation();

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        <DataCard
          styles={"w-full"}
          title={"Subscription Revenue"}
          count={trx_data?.revenue || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Subscribers"}
          count={trx_data?.subscribers ?? 0}
        />
        <DataCard
          styles={"w-full"}
          title={"Churn Rate"}
          count={trx_data?.churn_rate ?? 0}
          isPercentage={true}
        />
      </div>
      <TransactionTable
        columns={columns}
        rows={trx_data?.history}
        getKey={(row, index) => String(row.id ?? index)}
        onRowClick={(row) => push(routes.TRANSACTION_SUBSCRIPTION(String(row.id)))}
        page={page}
        totalPages={trx_data?.meta?.last_page ?? 1}
        perPage={trx_data?.meta?.per_page ?? DEFAULT_PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default PlansViews;
