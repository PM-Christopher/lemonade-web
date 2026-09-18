import React from "react";
import DataCard from "@/components/global/DataCard";
import { eventsHeaders, walletHeaders } from "@/data/tableData";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Event {
  id: number;
  event_name: string;
  event_image: string;
  organizer: string;
  tickets_sold: number;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED"; // Assuming possible statuses
  created_at: string; // ISO date string
}

interface EventIF {
  trx_data: any;
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
      <div className={"flex justify-between gap-[24px] px-[12px] pb-[16px] pt-[8px]"}>
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
                <th className="p-4 text-left text-[12px] font-semiBold text-text-grey" key={idx}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row: Event, index: number) => (
                <tr
                  key={index}
                  className="h-[72px] cursor-pointer border-b border-grey-20"
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
