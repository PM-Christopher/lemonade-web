import React, { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { centerNumericColumns } from "@/utils/tableAlign";
import dayjs from "dayjs";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import PaginationComp from "@/components/global/Pagination";
import { useLedgerQuery } from "@/features/transaction/queries";
import type { LedgerAccountType } from "@/features/transaction/api";
import { capitalizeSpecial } from "@/utils/helper";

const HEADERS = ["DATE", "ACCOUNT", "TYPE", "AMOUNT", "DESCRIPTION", "REFERENCE"];

const ACCOUNT_TYPES: LedgerAccountType[] = [
  "platform",
  "user_wallet",
  "tribe_owner",
  "event_organizer",
  "affiliate",
  "escrow_hold",
  "gateway",
  "payout_clearing",
];

function LedgerViews() {
  const [accountType, setAccountType] = useState<LedgerAccountType | "">("");
  const [range, setRange] = useState<DateRange | null>(null);
  const [page, setPage] = useState(1);
  const { data } = useLedgerQuery({
    account_type: accountType || undefined,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
    page,
  });
  const rows = data?.entries ?? [];

  return (
    <>
      <div className={"flex gap-3 px-3 py-3"}>
        <select
          aria-label="Filter by account"
          className={"bg-light-grey h-10 rounded-xl px-3"}
          value={accountType}
          onChange={(e) => {
            setAccountType(e.target.value as LedgerAccountType | "");
            setPage(1);
          }}
        >
          <option value="">All accounts</option>
          {ACCOUNT_TYPES.map((option) => (
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
                <tr key={row.id} className="border-grey-20 h-16 border-b">
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {dayjs(row.created_at).format("DD MMM, YYYY hh:mmA")}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {capitalizeSpecial(row.account_type)}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium capitalize"}>
                    {row.entry_type}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {row.currency} {row.amount}
                  </td>
                  <td className={"max-w-80 truncate p-4 font-sans text-sm font-medium"}>
                    {row.description ?? "—"}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.reference_type}</td>
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

export default LedgerViews;
