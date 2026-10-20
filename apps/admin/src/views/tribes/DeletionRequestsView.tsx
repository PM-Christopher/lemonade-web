"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTribeDeletionRequestsQuery } from "@/features/tribes/queries";
import type { TribeDeletionRequestItem } from "@/features/tribes/api";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
import { naira } from "@/views/transactions/transactionFormat";

const DecideDeletionModal = dynamic(() => import("@/modals/tribes/DecideDeletionModal"), {
  ssr: false,
});

const HEADERS = [
  "TRIBE",
  "OWNER",
  "MEMBERS",
  "ACCESS FEE",
  "TOTAL EARNED",
  "REQUESTED",
  "STATUS",
  "",
];

// Owners' requests to delete paid tribes, for an admin to approve or reject.
const DeletionRequestsView = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useTribeDeletionRequestsQuery("all", { enabled: isLoggedIn });
  const [selected, setSelected] = useState<{
    request: TribeDeletionRequestItem;
    decision: "approve" | "reject";
  } | null>(null);
  const requests = data?.requests ?? [];

  return (
    <div className="rounded-lg bg-white shadow-md">
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
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id} className="border-grey-20 h-18 border-b">
                <td className="p-4 font-sans text-sm font-medium">
                  {request.tribe?.name ?? "Deleted"}
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  {request.owner?.name ?? "N/A"}
                </td>
                <td className="p-4 font-sans text-sm font-medium">{request.tribe?.members ?? 0}</td>
                <td className="p-4 font-sans text-sm font-medium">
                  {naira(request.tribe?.access_fee)}
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  {naira(request.tribe?.total_earned)}
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  {dayjs(request.requested_at).format("DD MMM, YYYY hh:mm A")}
                </td>
                <td
                  className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeWords(request.status === "approved" ? "completed" : request.status))}`}
                >
                  {capitalizeWords(request.status)}
                </td>
                <td className="p-4">
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-red-1 cursor-pointer text-sm font-medium"
                        onClick={() => setSelected({ request, decision: "approve" })}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer text-sm font-medium"
                        onClick={() => setSelected({ request, decision: "reject" })}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                {isLoading ? "Loading..." : "No deletion requests"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <DecideDeletionModal
        key={selected?.request.id ?? "none"}
        request={selected?.request ?? null}
        decision={selected?.decision ?? "approve"}
        toggle={() => setSelected(null)}
      />
    </div>
  );
};

export default DeletionRequestsView;
