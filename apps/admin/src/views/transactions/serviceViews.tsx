import React from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
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
    header: "BUSINESS NAME",
    cell: (row) => <AvatarName name={row.business?.name} image={row.business?.image} />,
  },
  { header: "CLIENT NAME", cell: (row) => row.client?.name ?? "N/A" },
  { header: "AMOUNT", cell: (row) => naira(row.amount) },
  { header: "TRANSACTION TYPE", cell: (row) => row.transaction_type ?? "N/A" },
  { header: "START DATE", cell: (row) => shortDate(row.start_date) },
  { header: "STATUS", cell: (row) => <Status value={row.status} /> },
];

// Server-paginated: trx_data.history is only the current page.
function ServiceViews({ trx_data, page, onPageChange }: ViewProps) {
  const { push } = useNavigation();

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        <DataCard
          styles={"w-full"}
          title={"Amount In Escrow"}
          count={trx_data?.amount_in_escrow || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Pending Services"}
          count={trx_data?.pending_services ?? 0}
        />
      </div>
      <TransactionTable
        columns={columns}
        rows={trx_data?.history}
        // A payment shows once per money movement, so the type keeps each row's key unique.
        getKey={(row, index) => `${row.id ?? index}-${row.transaction_type}`}
        onRowClick={(row) => push(routes.TRANSACTION_SERVICE(String(row.id)))}
        page={page}
        totalPages={trx_data?.meta?.last_page ?? 1}
        perPage={trx_data?.meta?.per_page ?? DEFAULT_PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default ServiceViews;
