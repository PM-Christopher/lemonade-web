import React from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { images } from "@/lib/images";
import DataCard from "@/components/global/DataCard";
import { AvatarName } from "@/components/global/AvatarName";
import { TransactionTable, type TransactionColumn } from "@/components/global/TransactionTable";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { transactionStatus } from "@/utils/helper";
import type { TransactionHistoryRow, TransactionListResponse } from "@/features/transaction/api";
import { naira, shortDate } from "./transactionFormat";

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
    header: "EVENT NAME",
    cell: (row) => (
      <AvatarName
        name={row.event?.name}
        image={row.event?.image}
        fallbackSrc={images.DEFAULT_EVENT}
      />
    ),
  },
  { header: "PROMOTION NAME", cell: (row) => row.promotion_name ?? "N/A" },
  { header: "AMOUNT", cell: (row) => naira(row.amount) },
  { header: "DATE PAID", cell: (row) => shortDate(row.date_paid) },
  { header: "STATUS", cell: (row) => <Status value={row.status} /> },
];

// Server-paginated: trx_data.history is only the current page.
function PromotionViews({ trx_data, page, onPageChange }: ViewProps) {
  const { push } = useNavigation();

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        <DataCard
          styles={"w-full"}
          title={"Total Promotion Revenue"}
          count={trx_data?.total_revenue || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Promotions"}
          count={trx_data?.meta?.total ?? trx_data?.total_transactions ?? 0}
        />
      </div>
      <TransactionTable
        columns={columns}
        rows={trx_data?.history}
        getKey={(row, index) => String(row.id ?? index)}
        onRowClick={(row) => push(routes.TRANSACTION_PROMOTION(String(row.id)))}
        page={page}
        totalPages={trx_data?.meta?.last_page ?? 1}
        perPage={trx_data?.meta?.per_page ?? DEFAULT_PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default PromotionViews;
