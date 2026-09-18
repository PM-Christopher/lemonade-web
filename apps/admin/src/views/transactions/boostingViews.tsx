import React from "react";
import DataCard from "@/components/global/DataCard";
import { paymentTransactionHeaders } from "@/data/tableData";
import PaginationComp from "@/components/global/Pagination";
import dayjs from "dayjs";

interface BoostingIF {
  trx_data: any;
  page: number;
  onPageChange: (page: number) => void;
}

// Server-paginated (docs/ARCHITECTURE.md §22 Conflict 1) — trx_data.history
// is already just the current page; page/onPageChange are URL state owned
// by TransactionsClient. Rows aren't clickable: the backend has no detail
// (single-item) endpoint for boost transactions yet, only the list.
function BoostingViews({ trx_data, page, onPageChange }: BoostingIF) {
  const totalPages = trx_data?.meta?.last_page ?? 1;
  const perPage = trx_data?.meta?.per_page ?? 10;
  const paginatedData = trx_data?.history;

  return (
    <>
      <div className={"flex justify-between gap-[24px] px-[12px] pb-[16px] pt-[8px]"}>
        <DataCard
          styles={"w-full"}
          title={"Boosting Revenue"}
          count={trx_data?.total_revenue || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Transactions"}
          count={trx_data?.meta?.total ?? trx_data?.total_transactions ?? 0}
        />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mid-grey">
              {paymentTransactionHeaders.map((header, idx) => (
                <th className="p-4 text-left text-[12px] font-semiBold text-text-grey" key={idx}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row: any, index: any) => (
                <tr key={index} className="h-[72px] border-b border-grey-20">
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.reference}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {row.user?.name ?? "N/A"}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.amount}</td>
                  <td className={"p-4 font-sans text-sm font-medium capitalize"}>
                    {row.provider}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {row.paid_at ? dayjs(row.paid_at).format("DD MMM, YYYY hh:mmA") : "—"}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium capitalize"}>
                    {row.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={paymentTransactionHeaders.length}
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

export default BoostingViews;
