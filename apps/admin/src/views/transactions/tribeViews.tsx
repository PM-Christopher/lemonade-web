import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import dayjs from "dayjs";
import DataCard from "@/components/global/DataCard";
import PaginationComp from "@/components/global/Pagination";
import { tribePaymentHeaders } from "@/data/tableData";
import type { TransactionListResponse } from "@/features/transaction/api";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";

interface TribePaymentIF {
  trx_data: TransactionListResponse | undefined;
  page: number;
  onPageChange: (page: number) => void;
}

// Server-paginated; page state lives in TransactionsClient.
function TribePaymentViews({ trx_data, page, onPageChange }: TribePaymentIF) {
  const { push } = useNavigation();
  const totalPages = trx_data?.meta?.last_page ?? 1;
  const perPage = trx_data?.meta?.per_page ?? 10;
  const rows = trx_data?.history;

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        <DataCard
          styles={"w-full"}
          title={"Tribe Earnings"}
          count={trx_data?.tribe_earnings || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Tribe Commissions"}
          count={trx_data?.tribe_commissions || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Paid Tribes"}
          count={trx_data?.total_paid_tribes || 0}
        />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table
          className={`min-w-full table-auto border-collapse ${centerNumericColumns(tribePaymentHeaders)}`}
        >
          <thead>
            <tr className="bg-mid-grey">
              {tribePaymentHeaders.map((header) => (
                <th
                  className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-grey-20 h-18 cursor-pointer border-b"
                  onClick={() => push(routes.TRANSACTION_TRIBE(String(row.id)))}
                >
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.reference}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.user?.name ?? "N/A"}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.tribe_name ?? "N/A"}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    ₦{Number(row.amount).toLocaleString()}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {row.paid_at ? dayjs(row.paid_at).format("DD MMM, YYYY hh:mmA") : "—"}
                  </td>
                  <td
                    className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeWords(row.status))}`}
                  >
                    {capitalizeWords(row.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tribePaymentHeaders.length}
                  className="p-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default TribePaymentViews;
