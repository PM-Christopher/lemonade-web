import React, { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { centerNumericColumns } from "@/utils/tableAlign";
import { naira } from "@/views/transactions/transactionFormat";
import { SearchIcon, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import PaginationComp from "@/components/global/Pagination";
import { usePlanSubscribersQuery } from "@/features/subscriptions/queries";
import type { SubscriptionStatus } from "@/features/subscriptions/api";
import useDebounce from "@/hooks/useDebounce";
import { capitalizeSpecial, GetStatusClass } from "@/utils/helper";

interface PlanSubscribersModalProps {
  isOpen: boolean;
  toggle: () => void;
  planId?: string;
  planTitle?: string;
}

const STATUS_OPTIONS: ReadonlyArray<{ value: SubscriptionStatus | ""; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past due" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

const HEADERS = ["SUBSCRIBER", "EMAIL", "CYCLE", "AMOUNT", "STATUS", "RENEWS / ENDS"];

function PlanSubscribersModal({ isOpen, toggle, planId, planTitle }: PlanSubscribersModalProps) {
  const [status, setStatus] = useState<SubscriptionStatus | "">("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue: search } = useDebounce(searchTerm, 400);
  const { data, isLoading } = usePlanSubscribersQuery(isOpen ? planId : undefined, {
    status: status || undefined,
    search: search.trim() || undefined,
    page,
  });
  const subscribers = data?.subscribers ?? [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{planTitle} subscribers</DialogTitle>
        <div className="max-h-[85vh] w-250 max-w-[95vw] overflow-y-auto rounded-xl bg-white pt-4">
          <div className={"flex items-center justify-between px-5 py-2"}>
            <p className="text-body-xl font-sans font-semibold">
              {planTitle} subscribers{data ? ` (${data.meta.total})` : ""}
            </p>
            <div className={"flex items-center gap-3"}>
              <div className="bg-light-grey border-grey-20 flex h-10 w-64 items-center gap-2 rounded-xl border px-3">
                <SearchIcon className="text-grey-40 h-3 w-3" aria-hidden="true" />
                <input
                  type="text"
                  aria-label="Search subscribers"
                  placeholder="Search name, email, ID..."
                  className="text-body-s w-full bg-transparent focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <select
                aria-label="Filter by status"
                className={"bg-light-grey h-10 rounded-xl px-3"}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as SubscriptionStatus | "");
                  setPage(1);
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button type="button" aria-label="Close" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <table
            className={`min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}
          >
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
              {subscribers.length > 0 ? (
                subscribers.map((row) => (
                  <tr key={row.id} className="border-grey-20 h-16 border-b">
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.user?.name ?? "—"}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row.user?.email ?? "—"}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium capitalize"}>
                      {row.billing_cycle}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{naira(row.amount)}</td>
                    <td
                      className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeSpecial(row.status))}`}
                    >
                      {capitalizeSpecial(row.status)}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row.current_period_end
                        ? dayjs(row.current_period_end).format("DD MMM, YYYY")
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                    {isLoading
                      ? "Loading…"
                      : search.trim()
                        ? "No subscriber matches that search"
                        : "No subscribers"}
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
      </DialogContentBare>
    </Dialog>
  );
}

export default PlanSubscribersModal;
