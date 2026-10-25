import { currencyAmount } from "@/views/transactions/transactionFormat";
import React, { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { centerNumericColumns } from "@/utils/tableAlign";
import dayjs from "dayjs";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import DataCard from "@/components/global/DataCard";
import PaginationComp from "@/components/global/Pagination";
import { useAllPaymentsQuery } from "@/features/transaction/queries";
import type { PaymentStatus, PaymentType } from "@/features/transaction/api";
import useDebounce from "@/hooks/useDebounce";
import { capitalizeSpecial, GetStatusClass } from "@/utils/helper";

const HEADERS = ["REFERENCE", "USER", "TYPE", "AMOUNT", "PROVIDER", "DATE", "STATUS"];

const STATUSES: PaymentStatus[] = ["pending", "success", "failed", "abandoned"];
const TYPES: PaymentType[] = [
  "ticket",
  "subscription",
  "tribe",
  "promotion",
  "boost",
  "service_request",
];

function AllPaymentsViews() {
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [type, setType] = useState<PaymentType | "">("");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<DateRange | null>(null);
  const [page, setPage] = useState(1);
  const { debouncedValue: debouncedSearch } = useDebounce(search, 500);

  const { data } = useAllPaymentsQuery({
    status: status || undefined,
    type: type || undefined,
    search: debouncedSearch.trim() || undefined,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
    page,
  });
  const rows = data?.transactions ?? [];

  // Any filter change goes back to the first page.
  const onFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  return (
    <>
      <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
        {STATUSES.map((key) => (
          <DataCard
            key={key}
            styles={"w-full"}
            title={`${capitalizeSpecial(key)} (${data?.totals_by_status[key]?.count ?? 0})`}
            count={data?.totals_by_status[key]?.amount ?? 0}
            isPrice={true}
          />
        ))}
      </div>
      <div className={"flex gap-3 px-3 pb-3"}>
        <input
          aria-label="Search by reference"
          className={"bg-light-grey h-10 w-71.25 rounded-xl px-3"}
          placeholder="Search by reference"
          value={search}
          onChange={(e) => onFilter(setSearch)(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          className={"bg-light-grey h-10 rounded-xl px-3"}
          value={status}
          onChange={(e) => onFilter(setStatus)(e.target.value as PaymentStatus | "")}
        >
          <option value="">All statuses</option>
          {STATUSES.map((option) => (
            <option key={option} value={option}>
              {capitalizeSpecial(option)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by type"
          className={"bg-light-grey h-10 rounded-xl px-3"}
          value={type}
          onChange={(e) => onFilter(setType)(e.target.value as PaymentType | "")}
        >
          <option value="">All types</option>
          {TYPES.map((option) => (
            <option key={option} value={option}>
              {capitalizeSpecial(option)}
            </option>
          ))}
        </select>
        <DateRangePicker
          value={range}
          onChange={(value) => {
            setRange(value);
            setPage(1);
          }}
        />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table className={`min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}>
          <thead>
            <tr className="bg-mid-grey">
              {HEADERS.map((header) => (
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
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className="border-grey-20 h-18 border-b">
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.reference}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.user?.name ?? "N/A"}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {capitalizeSpecial(row.type)}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {currencyAmount(row.currency, row.amount)}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium capitalize"}>{row.provider}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {dayjs(row.paid_at ?? row.created_at).format("DD MMM, YYYY hh:mmA")}
                  </td>
                  <td
                    className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeSpecial(row.status))}`}
                  >
                    {capitalizeSpecial(row.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationComp
          currentPage={page}
          totalPages={data?.meta.last_page ?? 1}
          onPageChange={setPage}
          perPage={data?.meta.per_page ?? DEFAULT_PAGE_SIZE}
        />
      </div>
    </>
  );
}

export default AllPaymentsViews;
