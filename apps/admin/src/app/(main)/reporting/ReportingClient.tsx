"use client";
import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { reportHeaders } from "@/data/tableData";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useReportsQuery } from "@/features/reporting/queries";
import type { ReportRow } from "@/features/reporting/api";
import { GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import DateRangePicker, { toApiTime, type DateRange } from "@/components/global/DateRangePicker";
import useDebounce from "@/hooks/useDebounce";
import { images } from "@/lib/images";

const PER_PAGE = 10;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Resolved" },
  { value: "deleted", label: "Deleted" },
];

// Backend "completed" reads as resolved.
export const reportStatusLabel = (status: string) =>
  status === "completed" ? "Resolved" : status.charAt(0).toUpperCase() + status.slice(1);

const categoryLabel = (category: string) =>
  category.endsWith("s") ? category.slice(0, -1) : category;

function ReportingClient() {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [pageState, setPageState] = useState({ page: 1, signature: "" });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState<DateRange | null>(null);
  const { debouncedValue: term } = useDebounce(search.trim(), 400);

  const filters = {
    ...(term ? { search: term } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(range ? { start_date: toApiTime(range.start), end_date: toApiTime(range.end) } : {}),
  };
  // A new filter starts again at page 1.
  const signature = JSON.stringify(filters);
  const page = pageState.signature === signature ? pageState.page : 1;
  const setPage = (next: number) => setPageState({ page: next, signature });
  const { data: reportData } = useReportsQuery({
    enabled: isLoggedIn,
    page,
    perPage: PER_PAGE,
    filters,
  });

  const rows = reportData?.reports ?? [];
  const totalPages = reportData?.meta?.last_page ?? 1;

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className="flex justify-between px-5">
        <p className="font-semiBold text-body-l">
          {reportData?.meta?.total ?? rows.length} Reports
        </p>
        <div className="flex justify-between gap-3">
          <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 shrink-0 items-center gap-3 rounded-xl border p-2 px-3">
            <SearchIcon className="text-grey-40 h-3 w-3" />
            <input
              id="search"
              type="text"
              aria-label="Search reports"
              className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
              placeholder="Search report, ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              aria-label="Filter by status"
              className="font-semiBold text-text-grey text-meta h-10 w-48.25 rounded-xl leading-normal"
            >
              <SelectValue placeholder="STATUS" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker value={range} onChange={setRange} />
        </div>
      </div>
      <div className="flex flex-col px-5">
        <div className="border-grey-20 flex flex-col rounded-xl border">
          <div className="rounded-lg bg-white shadow-md">
            <table
              className={`min-w-full table-auto border-collapse ${centerNumericColumns(reportHeaders)}`}
            >
              <thead>
                <tr className="bg-mid-grey">
                  {reportHeaders.map((header) => (
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
                  rows.map((row: ReportRow) => (
                    <tr
                      key={row.id}
                      className="border-grey-20 h-18 cursor-pointer border-b"
                      onClick={() => push(routes.REPORTING_DETAIL(row.id))}
                    >
                      <td className="p-4 font-sans text-sm font-medium">{row.unique_id}</td>
                      <td className="p-4 font-sans text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <Image
                            unoptimized
                            src={row.reported_by.image || images.AVATAR_1}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          {row.reported_by.name}
                        </span>
                      </td>
                      <td className="p-4 font-sans text-sm font-medium">
                        {categoryLabel(row.category)}
                      </td>
                      <td className="p-4 font-sans text-sm font-medium">{row.case}</td>
                      <td className="p-4 font-sans text-sm font-medium">
                        {dayjs(row.date_submitted_iso).format("DD MMM, YYYY hh:mm A")}
                      </td>
                      <td
                        className={`p-4 font-sans text-sm font-medium ${GetStatusClass(reportStatusLabel(row.status))}`}
                      >
                        {reportStatusLabel(row.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={reportHeaders.length}
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
              onPageChange={setPage}
              perPage={PER_PAGE}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportingClient;
