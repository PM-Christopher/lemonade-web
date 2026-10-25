"use client";
import { SearchBox } from "@/components/global/SearchBox";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { usePagination } from "@/hooks/usePagination";
import PaginationComp from "@/components/global/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { useDisputeListQuery } from "@/features/disputes/queries";
import { useAssignDisputeMutation } from "@/features/disputes/mutations";
import type { AdminDispute, DisputeFilters } from "@/features/disputes/api";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { errorMessage } from "@/lib/api-error";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";

const STATUS_OPTIONS = [
  { value: "pending", label: "Open" },
  { value: "settled", label: "Settled" },
  { value: "refunded", label: "Refunded" },
  { value: "released", label: "Released" },
  { value: "all", label: "All" },
];

const TABLE_HEADERS = [
  "Business",
  "Client",
  "Business owner",
  "Raised by",
  "Amount",
  "Waiting",
  "Assigned to",
  "Status",
];

type Quick = "all" | "overdue" | "unassigned" | "mine";

// "2d 4h" instead of 52.
export const waitingLabel = (hours: number) =>
  hours < 1 ? "Just now" : hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d ${hours % 24}h`;

function StatCard({
  label,
  value,
  hint,
  active,
  danger,
  onClick,
}: {
  label: string;
  value: number;
  hint: string;
  active: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 cursor-pointer rounded-xl border-2 bg-white p-5 text-left ${active ? "border-light-green" : "border-transparent"}`}
    >
      <p className="text-text-grey text-body-s font-normal">{label}</p>
      <p className={`text-body-xl mt-2 font-semibold ${danger && value > 0 ? "text-red-1" : ""}`}>
        {value}
      </p>
      <p className="text-text-grey text-meta mt-1">{hint}</p>
    </button>
  );
}

// The disputes queue: who is waiting longest, who has each one, and one-click take-over.
function DisputesClient() {
  const { push } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState("pending");
  const [quick, setQuick] = useState<Quick>("all");
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filters: DisputeFilters = {
    assignee: quick === "mine" ? "me" : quick === "unassigned" ? "unassigned" : undefined,
    overdue: quick === "overdue",
    search: term,
  };
  const { data, isLoading } = useDisputeListQuery(status, { enabled: isLoggedIn, filters });
  const assignMutation = useAssignDisputeMutation();
  const { data: me } = useCurrentAdminQuery();
  const myId = me ? String(me.id) : null;
  const summary = data?.summary;

  const disputes = data?.disputes ?? [];

  const pickQuick = (next: Quick) => {
    // The cards only apply to the open queue.
    setStatus("pending");
    setQuick(quick === next ? "all" : next);
  };

  const assign = (dispute: AdminDispute, adminId?: string | null) => {
    setBusyId(dispute.id);
    assignMutation.mutate(
      { id: dispute.id, adminId },
      {
        onSuccess: () =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: adminId === null ? "Put back in the queue" : "It's yours now",
              type: "success",
            }),
          ),
        onError: (error) =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Couldn't change the assignment."),
              type: "error",
            }),
          ),
        onSettled: () => setBusyId(null),
      },
    );
  };

  const pager = usePagination(disputes, `${status}|${quick}|${term}`);

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className={"flex justify-between px-5"}>
        <div>
          <p className={"font-semiBold text-body-l"}>{disputes.length} Disputes</p>
          <p className="text-text-grey text-body-s">
            Oldest first. A dispute is overdue after {summary?.overdue_after_hours ?? 48} hours.
          </p>
        </div>
        <div className={"flex justify-between gap-3"}>
          <SearchBox
            value={searchValue}
            onChange={setSearchValue}
            label="Search disputes"
            placeholder="Search business, client, owner..."
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setQuick("all");
            }}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="font-semiBold text-text-grey focus:!border-light-green-50 text-meta h-10 w-48.25 rounded-xl leading-normal"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-3 px-5">
        <StatCard
          label="Open"
          value={summary?.open ?? 0}
          hint="All waiting for a decision"
          active={quick === "all" && status === "pending"}
          onClick={() => {
            setStatus("pending");
            setQuick("all");
          }}
        />
        <StatCard
          label="Overdue"
          value={summary?.overdue ?? 0}
          hint={`Waiting over ${summary?.overdue_after_hours ?? 48} hours`}
          active={quick === "overdue"}
          danger
          onClick={() => pickQuick("overdue")}
        />
        <StatCard
          label="Settled"
          value={summary?.settled ?? 0}
          hint="Refunded or released"
          active={status === "settled"}
          onClick={() => {
            setStatus("settled");
            setQuick("all");
          }}
        />
        <StatCard
          label="Unassigned"
          value={summary?.unassigned ?? 0}
          hint="Nobody has taken it yet"
          active={quick === "unassigned"}
          onClick={() => pickQuick("unassigned")}
        />
        <StatCard
          label="Mine"
          value={summary?.mine ?? 0}
          hint="Assigned to you"
          active={quick === "mine"}
          onClick={() => pickQuick("mine")}
        />
      </div>
      <div className={"flex flex-col px-5"}>
        <div className={"border-grey-20 flex flex-col rounded-xl border"}>
          <div className="rounded-lg bg-white shadow-md">
            <table
              className={`min-w-full table-auto border-collapse ${centerNumericColumns(TABLE_HEADERS)}`}
            >
              <thead>
                <tr className="bg-mid-grey">
                  {TABLE_HEADERS.map((header) => (
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
                {disputes.length > 0 ? (
                  pager.pageItems.map((dispute) => {
                    const isOpen = dispute.status === "pending";
                    const assignedToMe = myId !== null && dispute.assignee?.id === myId;
                    return (
                      <tr
                        key={dispute.id}
                        className="border-grey-20 hover:bg-light-grey h-18 cursor-pointer border-b"
                        onClick={() => push(routes.DISPUTE_DETAIL(dispute.id))}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dispute.job?.business?.name ?? "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dispute.job?.client?.name ?? "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dispute.job?.owner?.name ?? "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(dispute.raised_by_role)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dispute.job ? `₦${dispute.job.amount}` : "N/A"}
                        </td>
                        <td
                          className="p-4 font-sans text-sm"
                          title={dayjs(dispute.date_raised).format("DD MMM, YYYY hh:mm A")}
                        >
                          {isOpen ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${dispute.overdue ? "text-red-1 bg-red-50" : "bg-mid-grey"}`}
                            >
                              {waitingLabel(dispute.age_hours)}
                              {dispute.overdue ? " · overdue" : ""}
                            </span>
                          ) : (
                            <span
                              className="text-text-grey"
                              title={
                                dispute.resolved_by
                                  ? `Settled by ${dispute.resolved_by.name}`
                                  : undefined
                              }
                            >
                              {dispute.resolved_at
                                ? `Settled ${dayjs(dispute.resolved_at).format("DD MMM, YYYY")}`
                                : "Closed"}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-sans text-sm font-medium">
                          {dispute.assignee ? (
                            <span className="flex items-center gap-2">
                              {dispute.assignee.name}
                              {isOpen && assignedToMe && (
                                <button
                                  type="button"
                                  disabled={busyId === dispute.id}
                                  className="text-text-grey cursor-pointer text-xs underline"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    assign(dispute, null);
                                  }}
                                >
                                  Release
                                </button>
                              )}
                            </span>
                          ) : isOpen ? (
                            <button
                              type="button"
                              disabled={busyId === dispute.id}
                              className="border-light-grey-50 cursor-pointer rounded-lg border px-2 py-1 text-xs disabled:opacity-60"
                              onClick={(event) => {
                                event.stopPropagation();
                                assign(dispute);
                              }}
                            >
                              {busyId === dispute.id ? "Taking…" : "Take it"}
                            </button>
                          ) : (
                            <span className="text-text-grey">N/A</span>
                          )}
                        </td>
                        <td
                          className={`p-4 font-sans text-sm font-medium ${GetStatusClass(isOpen ? "Pending" : "Resolved")}`}
                        >
                          {isOpen ? "Open" : capitalizeWords(dispute.status)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="p-4 text-center text-sm text-gray-500"
                    >
                      {isLoading ? "Loading..." : "No disputes match."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <PaginationComp
              currentPage={pager.page}
              totalPages={pager.totalPages}
              onPageChange={pager.setPage}
              perPage={DEFAULT_PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DisputesClient;
