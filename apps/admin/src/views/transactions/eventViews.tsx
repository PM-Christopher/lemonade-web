import React from "react";
import DataCard from "@/components/global/DataCard";
import { eventsHeaders, walletHeaders } from "@/data/tableData";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { TransactionListResponse } from "@/features/transaction/api";

interface EventIF {
  trx_data: TransactionListResponse | undefined;
  page: number;
  onPageChange: (page: number) => void;
}

// Server-paginated (docs/ARCHITECTURE.md §22 Conflict 1) — trx_data.history
// is already just the current page; page/onPageChange are URL state owned
// by TransactionsClient.
function EventViews({ trx_data, page, onPageChange }: EventIF) {
  const router = useRouter();
  const totalPages = trx_data?.meta?.last_page ?? 1;
  const perPage = trx_data?.meta?.per_page ?? 10;
  const paginatedData = trx_data?.history;

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
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mid-grey">
              {eventsHeaders.map((header, idx) => (
                <th className="font-semiBold text-text-grey p-4 text-left text-[12px]" key={idx}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-grey-20 h-[72px] cursor-pointer border-b"
                  onClick={() => router.push(`/transactions/${row.id}/event-details`)}
                >
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.id}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.event_name}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.organizer}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.tickets_sold}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.tickets_sold}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {dayjs(row.created_at).format("DD MMM, YYYY hh:mmA")}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={walletHeaders.length}
                  className="p-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <PaginationComp
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          perPage={perPage}
        />
      </div>
    </>
  );
}

export default EventViews;
