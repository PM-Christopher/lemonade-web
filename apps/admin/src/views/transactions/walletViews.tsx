import React from "react";
import DataCard from "@/components/global/DataCard";
import { walletHeaders } from "@/data/tableData";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import type { TransactionListResponse } from "@/features/transaction/api";

interface WalletIF {
  trx_data: TransactionListResponse | undefined;
  page: number;
  onPageChange: (page: number) => void;
}

// Server-paginated (docs/ARCHITECTURE.md §22 Conflict 1) — trx_data.history
// is already just the current page; page/onPageChange are URL state owned
// by TransactionsClient.
function WalletViews({ trx_data, page, onPageChange }: WalletIF) {
  const router = useRouter();
  const totalPages = trx_data?.meta?.last_page ?? 1;
  const perPage = trx_data?.meta?.per_page ?? 10;
  const paginatedData = trx_data?.history;

  return (
    <>
      <div className={"flex justify-between gap-[24px] px-[12px] pt-[8px] pb-[16px]"}>
        <DataCard
          styles={"w-full"}
          title={"Wallet Revenue"}
          count={trx_data?.wallet_revenue || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Wallets"}
          count={trx_data?.meta?.total ?? trx_data?.history?.length ?? 0}
        />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mid-grey">
              {walletHeaders.map((header, idx) => (
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
                  onClick={() => router.push(`/transactions/${row.id}/wallet-details`)}
                >
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.txn_id}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.fullname}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.amount}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.created_at}</td>
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

export default WalletViews;
