"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DataCard from "@/components/global/DataCard";
import { RiskBadge } from "@/components/wallet/PayoutRisk";
import PaginationComp from "@/components/global/Pagination";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import { AvatarName } from "@/components/global/AvatarName";
import { ExportMenu } from "@/components/global/ExportMenu";
import { useNavigation } from "@/hooks/useNavigation";
import { naira } from "@/views/transactions/transactionFormat";
import useDebounce from "@/hooks/useDebounce";
import { routes } from "@/lib/routes";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { walletManagementHeaders } from "@/data/tableData";
import { downloadBlob, downloadCSV, transactionStatus } from "@/utils/helper";
import {
  usePointsRatesQuery,
  useWalletDataQuery,
  useWithdrawalRequestsQuery,
} from "@/features/wallet/queries";
import { useExportCsvMutation, useExportFileMutation } from "@/features/exports/mutations";

// Off the initial bundle — only needed once "Edit threshold"/"Edit" (points rate) is clicked.
const WalletThresholdModal = dynamic(
  () => import("@/modals/wallet-management/WalletThresholdModal"),
  { ssr: false },
);
const PointsRateModal = dynamic(() => import("@/modals/wallet-management/PointsRateModal"), {
  ssr: false,
});

const PER_PAGE = 10;
const STATUS_OPTIONS = ["pending", "successful", "rejected"] as const;

// Withdrawal requests with their wallet totals, filters and export.
function WalletManagementClient() {
  const { push } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [editThreshold, setEditThreshold] = useState(false);
  const [editingRateCurrency, setEditingRateCurrency] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [range, setRange] = useState<DateRange | null>(null);
  const { debouncedValue: search } = useDebounce(searchTerm, 500);

  const { data: withdrawalRequests } = useWithdrawalRequestsQuery({
    enabled: isLoggedIn,
    page: currentPage,
    perPage: PER_PAGE,
    status: status || undefined,
    search: search.trim() || undefined,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
  });
  const { data: walletData } = useWalletDataQuery({ enabled: isLoggedIn });
  const { data: pointsRatesData } = usePointsRatesQuery({ enabled: isLoggedIn });
  const editingRate = pointsRatesData?.rates.find((rate) => rate.currency === editingRateCurrency);
  const exportCsv = useExportCsvMutation();
  const exportFile = useExportFileMutation();

  const rows = withdrawalRequests?.history ?? [];
  const totalPages = withdrawalRequests?.meta?.last_page ?? 1;

  // Any filter change goes back to the first page.
  const filtered = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value);
      setCurrentPage(1);
    };
  };

  const notify = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const onExport = (type: "csv" | "pdf") => {
    const onError = (error: Error) => notify(error?.message || "Something went wrong", "error");
    if (type === "csv") {
      exportCsv.mutate("withdrawal_requests", {
        onSuccess: (csv) => {
          downloadCSV(csv, "withdrawal_requests.csv");
          notify("Downloaded", "success");
        },
        onError,
      });
      return;
    }
    exportFile.mutate(
      { table: "withdrawal_requests", type },
      {
        onSuccess: (file) => {
          downloadBlob(file, "withdrawal_requests.pdf");
          notify("Downloaded", "success");
        },
        onError,
      },
    );
  };

  return (
    <>
      <section className="mt-5 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>{walletData?.total_wallets ?? 0} Wallets</p>
          <div className={"flex justify-between gap-3"}>
            <div className="bg-light_grey border-grey-20 flex h-10 w-80 items-center gap-3 rounded-xl border p-2 px-3">
              <SearchIcon className={"text-grey-40 h-3 w-3"} />
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => filtered(setSearchTerm)(e.target.value)}
                className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search wallet ID, name, amount or date"
              />
            </div>
            <select
              aria-label="Filter by status"
              className={"bg-light-grey h-10 rounded-xl px-3"}
              value={status}
              onChange={(e) => filtered(setStatus)(e.target.value)}
            >
              <option value="">Status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {transactionStatus(option).label}
                </option>
              ))}
            </select>
            <DateRangePicker value={range} onChange={filtered(setRange)} />
            <ExportMenu onExport={onExport} isBusy={exportCsv.isPending || exportFile.isPending} />
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className={"grid auto-cols-fr grid-flow-col gap-6 overflow-x-auto px-3 pt-2 pb-4"}>
              <DataCard
                title={"Wallet Revenue"}
                count={walletData?.wallet_revenue || 0}
                isPrice={true}
              />
              <DataCard title={"Total Wallets"} count={walletData?.total_wallets || 0} />
              <DataCard
                title={"Withdrawal Threshold"}
                count={walletData?.withdrawal_threshold || 0}
                isPrice={true}
                isEditable={true}
                handleChange={() => setEditThreshold(true)}
              />
              {pointsRatesData?.rates.map((rate) => (
                <DataCard
                  key={rate.currency}
                  title={`Points Rate (${rate.currency})`}
                  count={rate.rate_minor_per_point / 100}
                  isPrice={rate.currency === "NGN"}
                  isEditable={true}
                  handleChange={() => setEditingRateCurrency(rate.currency)}
                />
              ))}
            </div>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {walletManagementHeaders.map((header) => (
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
                    rows.map((row) => {
                      const rowStatus = transactionStatus(row.status);
                      return (
                        <tr
                          key={row.id}
                          className="border-grey-20 h-18 cursor-pointer border-b"
                          onClick={() => push(routes.WALLET_DETAIL(row.id))}
                        >
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {row.wallet_id ?? "N/A"}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            <AvatarName name={row.fullname} image={row.image} />
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {naira(row.amount)}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {naira(row.balance)}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {dayjs(row.created_at).format("DD MMM, YYYY hh:mm A")}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {row.status === "pending" ? <RiskBadge risk={row.risk} /> : null}
                          </td>
                          <td
                            className={`p-4 font-sans text-sm font-medium ${rowStatus.className}`}
                          >
                            {rowStatus.label}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={walletManagementHeaders.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <PaginationComp
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                perPage={PER_PAGE}
              />
            </div>
          </div>
        </div>
      </section>
      <WalletThresholdModal isOpen={editThreshold} toggle={() => setEditThreshold(false)} />
      {editingRate && (
        <PointsRateModal
          isOpen={Boolean(editingRateCurrency)}
          toggle={() => setEditingRateCurrency(null)}
          currency={editingRate.currency}
          currentRate={String(editingRate.rate_minor_per_point / 100)}
        />
      )}
    </>
  );
}

export default WalletManagementClient;
