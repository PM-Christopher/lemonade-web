import React from "react";
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
  { header: "TXN ID", cell: (row) => row.transaction_id as string | undefined },
  {
    header: "EVENT NAME",
    cell: (row) => (
      <AvatarName
        name={row.event_name}
        image={row.event_image}
        fallbackSrc={images.DEFAULT_EVENT}
      />
    ),
  },
  { header: "ORGANIZER NAME", cell: (row) => row.organizer },
  { header: "AMOUNT", cell: (row) => naira(row.amount) },
  { header: "TICKETS SOLD", cell: (row) => row.tickets_sold },
  { header: "DATE PAID", cell: (row) => shortDate(row.created_at) },
  { header: "STATUS", cell: (row) => <Status value={row.status} /> },
];

// Server-paginated: trx_data.history is only the current page.
function EventViews({ trx_data, page, onPageChange }: ViewProps) {
  const { push } = useNavigation();

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        <DataCard
          styles={"w-full"}
          title={"Total Ticket Revenue"}
          count={trx_data?.total_revenue || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Tickets Sold"}
          count={trx_data?.tickets_sold || 0}
        />
        <DataCard styles={"w-full"} title={"Total Events"} count={trx_data?.total_events || 0} />
      </div>
      <TransactionTable
        columns={columns}
        rows={trx_data?.history}
        getKey={(row, index) => String(row.id ?? index)}
        onRowClick={(row) => push(routes.TRANSACTION_EVENT(String(row.id)))}
        page={page}
        totalPages={trx_data?.meta?.last_page ?? 1}
        perPage={trx_data?.meta?.per_page ?? 10}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default EventViews;
