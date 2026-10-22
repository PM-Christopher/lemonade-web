"use client";
import React, { useState } from "react";
import { ActionMenu } from "@/components/global/ActionMenu";
import { centerNumericColumns } from "@/utils/tableAlign";
import dayjs from "dayjs";
import { CopyIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import PaginationComp from "@/components/global/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { usePaymentsToReviewQuery } from "@/features/payments/queries";
import { useVerifyPaymentMutation } from "@/features/payments/mutations";
import type { PaymentToReview } from "@/features/payments/api";
import useDebounce from "@/hooks/useDebounce";
import { errorMessage } from "@/lib/api-error";
import { capitalizeWords } from "@/utils/helper";
import { naira } from "@/views/transactions/transactionFormat";

const TABS = [
  { key: "all", label: "All" },
  { key: "stuck", label: "Stuck" },
  { key: "failed", label: "Failed" },
] as const;

const HEADERS = ["USER", "TYPE", "AMOUNT", "STARTED", "STATE", "REFERENCE", ""];

// "2h 10m" instead of 130.
const waiting = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ${minutes % 60}m` : `${Math.floor(hours / 24)}d ${hours % 24}h`;
};

function StatCard({
  label,
  value,
  hint,
  active,
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const body = (
    <>
      <p className="text-text-grey text-body-s font-normal">{label}</p>
      <p className="text-body-xl mt-2 font-semibold">{value}</p>
      {hint && <p className="text-text-grey text-meta mt-1">{hint}</p>}
    </>
  );
  const base = "flex-1 rounded-xl bg-white p-5 text-left";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`${base} cursor-pointer border-2 ${active ? "border-light-green" : "border-transparent"}`}
    >
      {body}
    </button>
  ) : (
    <div className={base}>{body}</div>
  );
}

// Payments that started but never finished, with a one-click check against Paystack.
function PaymentsReviewClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [type, setType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const { debouncedValue: search } = useDebounce(searchTerm, 400);

  const { data, isLoading, isFetching } = usePaymentsToReviewQuery(
    {
      status: tab,
      type: type === "all" ? undefined : type,
      search: search.trim() || undefined,
      page,
    },
    { enabled: isLoggedIn },
  );
  const verifyMutation = useVerifyPaymentMutation();
  const payments = data?.payments ?? [];
  const stuckOnPage = payments.filter((payment) => payment.state === "stuck");

  const toast = (message: string, kind: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type: kind }));

  const changeFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  const check = (payment: PaymentToReview) => {
    setCheckingId(payment.id);
    verifyMutation.mutate(payment.id, {
      onSuccess: (result) =>
        toast(result.message, result.status === "success" ? "success" : "error"),
      onError: (error) => toast(errorMessage(error, "Couldn't check this payment."), "error"),
      onSettled: () => setCheckingId(null),
    });
  };

  // Checks every stuck payment on this page, one after another, and reports how many finished.
  const checkAll = async () => {
    setBulk({ done: 0, total: stuckOnPage.length });
    let completed = 0;
    for (const [index, payment] of stuckOnPage.entries()) {
      try {
        const result = await verifyMutation.mutateAsync(payment.id);
        if (result.status === "success") completed += 1;
      } catch {
        // A failed check leaves that payment in the list for another try.
      }
      setBulk({ done: index + 1, total: stuckOnPage.length });
    }
    setBulk(null);
    toast(`${completed} of ${stuckOnPage.length} payments were confirmed by Paystack.`, "success");
  };

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5">
        <div>
          <p className="font-semiBold text-body-l">Payments review</p>
          <p className="text-text-grey text-body-s">
            Payments that never finished. Check one with Paystack to complete it if the money
            arrived.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-light_grey border-grey-20 flex h-10 w-64 items-center gap-3 rounded-xl border px-3">
            <SearchIcon className="text-grey-40 h-3 w-3" />
            <input
              type="text"
              aria-label="Search payments"
              className="text-body-s w-full bg-transparent focus:outline-none"
              placeholder="Search reference, name or email"
              value={searchTerm}
              onChange={(event) => changeFilter(() => setSearchTerm(event.target.value))}
            />
          </div>
          <div className="w-44 shrink-0">
            <Select value={type} onValueChange={(value) => changeFilter(() => setType(value))}>
              <SelectTrigger aria-label="Filter by payment type" className="h-10 w-full rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {data?.types.map((item) => (
                  <SelectItem key={item} value={item}>
                    {capitalizeWords(item.replace(/_/g, " "))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex gap-3 px-5">
        <StatCard
          label="Stuck payments"
          value={data?.stuck_count ?? 0}
          hint="Pending for over 15 minutes"
          active={tab === "stuck"}
          onClick={() => changeFilter(() => setTab(tab === "stuck" ? "all" : "stuck"))}
        />
        <StatCard
          label="Failed payments"
          value={data?.failed_count ?? 0}
          hint="Declined in the last 30 days"
          active={tab === "failed"}
          onClick={() => changeFilter(() => setTab(tab === "failed" ? "all" : "failed"))}
        />
        <StatCard
          label="Amount at risk"
          value={naira(data?.amount_at_risk)}
          hint="Money in stuck payments"
        />
      </div>
      <div className="flex flex-col px-5">
        <div className="border-grey-20 rounded-xl border bg-white">
          <div className="flex items-center justify-between px-3 pt-2">
            <div className="bg-mid-grey flex items-center gap-2 rounded-xl p-1">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`text-body-s cursor-pointer rounded-lg px-3 py-1 ${tab === item.key ? "bg-white font-semibold" : "text-text-grey"}`}
                  onClick={() => changeFilter(() => setTab(item.key))}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {stuckOnPage.length > 1 && (
              <button
                type="button"
                disabled={bulk !== null}
                onClick={() => void checkAll()}
                className="bg-gradient-green flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                <RefreshCwIcon className={`h-4 w-4 ${bulk ? "animate-spin" : ""}`} />
                {bulk
                  ? `Checking ${bulk.done}/${bulk.total}…`
                  : `Check the ${stuckOnPage.length} stuck on this page`}
              </button>
            )}
          </div>
          <table
            className={`mt-2 min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}
          >
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
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-grey-20 h-16 border-b">
                    <td className="p-4 font-sans text-sm">
                      <p className="font-medium">{payment.user?.name ?? "N/A"}</p>
                      <p className="text-text-grey text-meta">{payment.user?.email}</p>
                    </td>
                    <td className="p-4 font-sans text-sm font-medium">
                      {capitalizeWords(payment.type.replace(/_/g, " "))}
                    </td>
                    <td className="p-4 font-sans text-sm font-medium">{naira(payment.amount)}</td>
                    <td className="p-4 font-sans text-sm">
                      <p className="font-medium">
                        {dayjs(payment.created_at).format("DD MMM, hh:mm A")}
                      </p>
                      <p className="text-text-grey text-meta">{waiting(payment.age_minutes)} ago</p>
                    </td>
                    <td className="p-4 font-sans text-sm font-medium">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${payment.state === "stuck" ? "text-warning-bold bg-orange-50" : "text-red-1 bg-red-50"}`}
                      >
                        {payment.state === "stuck" ? "Stuck" : "Failed"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      <span className="flex items-center gap-1">
                        {payment.reference.slice(0, 14)}
                        <button
                          type="button"
                          aria-label="Copy reference"
                          className="text-grey-40 cursor-pointer"
                          onClick={() => void navigator.clipboard?.writeText(payment.reference)}
                        >
                          <CopyIcon className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </td>
                    <td className="p-4">
                      <ActionMenu
                        label={`Actions for ${payment.reference.slice(0, 14)}`}
                        items={[
                          {
                            label: checkingId === payment.id ? "Checking…" : "Check with Paystack",
                            disabled: checkingId === payment.id || bulk !== null,
                            onSelect: () => check(payment),
                          },
                          {
                            label: "Copy reference",
                            onSelect: () => void navigator.clipboard?.writeText(payment.reference),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={HEADERS.length} className="p-10 text-center text-sm text-gray-500">
                    {isLoading ? "Loading..." : "Nothing to review. Every payment has finished."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationComp
            currentPage={data?.meta?.current_page ?? 1}
            totalPages={data?.meta?.last_page ?? 1}
            onPageChange={setPage}
            perPage={data?.meta?.per_page ?? 25}
          />
        </div>
      </div>
    </section>
  );
}

export default PaymentsReviewClient;
