"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLayout from "@/components/layouts/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { useDisputeListQuery } from "@/features/disputes/queries";
import type { AdminDispute } from "@/features/disputes/api";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";

const STATUS_OPTIONS = [
  { value: "pending", label: "Open" },
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
  "Date",
  "Status",
];

function searchableFields(dispute: AdminDispute): string[] {
  return [
    dispute.job?.business?.name,
    dispute.job?.client?.name,
    dispute.job?.owner?.name,
    dispute.raised_by?.name,
  ].filter((value): value is string => Boolean(value));
}

function DisputesClient() {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState("pending");
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useDisputeListQuery(status, { enabled: isLoggedIn });

  const disputes = useMemo(() => {
    const all = data?.disputes ?? [];
    const q = searchValue.trim().toLowerCase();
    if (!q) return all;
    return all.filter((dispute) =>
      searchableFields(dispute).some((value) => value.toLowerCase().includes(q)),
    );
  }, [data, searchValue]);

  return (
    <MainLayout>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>{disputes.length} Disputes</p>
          <div className={"flex justify-between gap-3"}>
            <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 items-center gap-3 rounded-xl border p-2 px-3">
              <SearchIcon className={"text-grey-40 h-3 w-3"} />
              <input
                id="search"
                type="text"
                aria-label="Search disputes"
                className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search business, client, owner..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
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
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
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
                    disputes.map((dispute) => (
                      <tr
                        key={dispute.id}
                        className="border-grey-20 h-18 cursor-pointer border-b"
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
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dayjs(dispute.date_raised).format("DD MMM, YYYY hh:mm A")}
                        </td>
                        <td
                          className={`p-4 font-sans text-sm font-medium ${GetStatusClass(dispute.status === "pending" ? "Pending" : "Resolved")}`}
                        >
                          {dispute.status === "pending" ? "Open" : capitalizeWords(dispute.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        {isLoading ? "Loading..." : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default DisputesClient;
