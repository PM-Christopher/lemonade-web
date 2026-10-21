"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronDownIcon, ChevronRightIcon, CopyIcon, SearchIcon, XIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLayout from "@/components/layouts/MainLayout";
import PaginationComp from "@/components/global/Pagination";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import { AvatarName } from "@/components/global/AvatarName";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { useAuditLogQuery } from "@/features/audit/queries";
import type { AuditLogEntry, AuditLogFilters } from "@/features/audit/api";
import useDebounce from "@/hooks/useDebounce";
import { capitalizeWords } from "@/utils/helper";

dayjs.extend(relativeTime);

const ALL = "all";
const HEADERS = ["WHEN", "ADMIN", "ACTION", "AREA", "TARGET", ""];

// Plain words for the details an admin sent.
const DETAIL_LABELS: Record<string, string> = {
  reason: "Reason",
  resolution: "Decision",
  amount: "Amount",
  status: "Status",
  commission_percentage: "Commission %",
  commission_charge: "Commission",
  threshold: "Threshold",
  type: "Type",
  name: "Name",
  title: "Title",
  promotion_date: "Promotion date",
  admin_id: "Assigned to (id)",
  points_rate: "Points rate",
};

function DetailPanel({ entry }: { entry: AuditLogEntry }) {
  const details = Object.entries(entry.details ?? {});

  return (
    <div className="bg-light-grey grid gap-x-10 gap-y-3 p-5 md:grid-cols-2">
      <div>
        <p className="text-text-grey text-meta">Exact time</p>
        <p className="text-body-s font-medium">
          {dayjs(entry.created_at).format("dddd, D MMMM YYYY [at] hh:mm:ss A")}
        </p>
      </div>
      <div>
        <p className="text-text-grey text-meta">From</p>
        <p className="text-body-s font-medium">
          {entry.method ?? "N/A"} request{entry.ip ? ` · IP ${entry.ip}` : ""}
        </p>
      </div>
      {entry.subject_id && (
        <div className="md:col-span-2">
          <p className="text-text-grey text-meta">Record id</p>
          <p className="text-body-s font-mono break-all">{entry.subject_id}</p>
        </div>
      )}
      {details.length > 0 ? (
        details.map(([key, value]) => (
          <div key={key}>
            <p className="text-text-grey text-meta">{DETAIL_LABELS[key] ?? capitalizeWords(key)}</p>
            <p className="text-body-s font-medium">{String(value)}</p>
          </div>
        ))
      ) : (
        <p className="text-text-grey text-body-s md:col-span-2">No extra details were sent.</p>
      )}
    </div>
  );
}

// Every recorded admin action, with filters and a closer look at each one.
function AuditLogClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminId, setAdminId] = useState(ALL);
  const [area, setArea] = useState(ALL);
  const [range, setRange] = useState<DateRange | null>(null);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { debouncedValue: search } = useDebounce(searchTerm, 400);

  const filters: AuditLogFilters = {
    search: search.trim() || undefined,
    admin_id: adminId === ALL ? undefined : adminId,
    area: area === ALL ? undefined : area,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
    page,
  };
  const { data, isLoading, isFetching } = useAuditLogQuery(filters, { enabled: isLoggedIn });
  const logs = data?.logs ?? [];
  const hasFilters = Boolean(search.trim()) || adminId !== ALL || area !== ALL || range !== null;

  // Any filter change goes back to the first page.
  const change = (apply: () => void) => {
    apply();
    setPage(1);
    setOpenId(null);
  };

  const clearFilters = () =>
    change(() => {
      setSearchTerm("");
      setAdminId(ALL);
      setArea(ALL);
      setRange(null);
    });

  const copy = (id: string) => {
    void navigator.clipboard?.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied((current) => (current === id ? null : current)), 1500);
  };

  return (
    <MainLayout>
      <section className="mt-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5">
          <div>
            <p className="font-semiBold text-body-l">Audit log</p>
            <p className="text-text-grey text-body-s">
              Who did what, and when. Click a row to see the details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-light_grey border-grey-20 flex h-10 w-64 items-center gap-3 rounded-xl border px-3">
              <SearchIcon className="text-grey-40 h-3 w-3" />
              <input
                type="text"
                aria-label="Search the audit log"
                className="text-body-s w-full bg-transparent focus:outline-none"
                placeholder="Search action or record id"
                value={searchTerm}
                onChange={(event) => change(() => setSearchTerm(event.target.value))}
              />
            </div>
            <div className="w-44 shrink-0">
              <Select value={adminId} onValueChange={(value) => change(() => setAdminId(value))}>
                <SelectTrigger aria-label="Filter by admin" className="h-10 w-full rounded-xl">
                  <SelectValue placeholder="Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All admins</SelectItem>
                  {data?.admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-44 shrink-0">
              <Select value={area} onValueChange={(value) => change(() => setArea(value))}>
                <SelectTrigger aria-label="Filter by area" className="h-10 w-full rounded-xl">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All areas</SelectItem>
                  {data?.areas.map((item) => (
                    <SelectItem key={item} value={item}>
                      {capitalizeWords(item.replace(/-/g, " "))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DateRangePicker value={range} onChange={(value) => change(() => setRange(value))} />
            {hasFilters && (
              <button
                type="button"
                className="text-text-grey flex cursor-pointer items-center gap-1 text-sm"
                onClick={clearFilters}
              >
                <XIcon className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col px-5">
          <div className="border-grey-20 rounded-xl border bg-white">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-mid-grey">
                  {HEADERS.map((header) => (
                    <th
                      key={header}
                      className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={isFetching && !isLoading ? "opacity-60" : ""}>
                {logs.length > 0 ? (
                  logs.map((entry) => {
                    const isOpen = openId === entry.id;
                    return (
                      <React.Fragment key={entry.id}>
                        <tr
                          className="border-grey-20 hover:bg-light-grey h-16 cursor-pointer border-b"
                          onClick={() => setOpenId(isOpen ? null : entry.id)}
                          aria-expanded={isOpen}
                        >
                          <td className="p-4 font-sans text-sm whitespace-nowrap">
                            <p className="font-medium">
                              {dayjs(entry.created_at).format("DD MMM, hh:mm A")}
                            </p>
                            <p className="text-text-grey text-meta">
                              {dayjs(entry.created_at).fromNow()}
                            </p>
                          </td>
                          <td className="p-4 font-sans text-sm font-medium">
                            <AvatarName name={entry.admin?.name ?? "Unknown"} />
                          </td>
                          <td className="p-4 font-sans text-sm font-medium">
                            {entry.message}
                            {entry.details?.reason && (
                              <span className="text-text-grey text-meta ml-2 font-normal">
                                “{String(entry.details.reason)}”
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-sans text-sm">
                            {entry.area && (
                              <span className="bg-mid-grey rounded-full px-2 py-0.5 text-xs">
                                {capitalizeWords(entry.area.replace(/-/g, " "))}
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-xs">
                            {entry.subject_id ? (
                              <span className="flex items-center gap-1">
                                {entry.subject_id.slice(0, 8)}…
                                <button
                                  type="button"
                                  aria-label="Copy record id"
                                  className="text-grey-40 cursor-pointer"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    copy(entry.subject_id as string);
                                  }}
                                >
                                  <CopyIcon className="h-3.5 w-3.5" />
                                </button>
                                {copied === entry.subject_id && (
                                  <span className="text-light-green-70">Copied</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-text-grey">N/A</span>
                            )}
                          </td>
                          <td className="p-4">
                            {isOpen ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="border-grey-20 border-b">
                            <td colSpan={HEADERS.length}>
                              <DetailPanel entry={entry} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={HEADERS.length} className="p-10 text-center text-sm text-gray-500">
                      {isLoading
                        ? "Loading..."
                        : hasFilters
                          ? "Nothing matches these filters."
                          : "No admin actions recorded yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <PaginationComp
              currentPage={data?.meta?.current_page ?? 1}
              totalPages={data?.meta?.last_page ?? 1}
              onPageChange={(next) => {
                setPage(next);
                setOpenId(null);
              }}
              perPage={data?.meta?.per_page ?? 25}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default AuditLogClient;
