"use client";
import React, { useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { transactionPageViews } from "@/utils/pageViews";
import PlansViews from "@/views/transactions/PlansViews";
import WalletViews from "@/views/transactions/walletViews";
import BoostingViews from "@/views/transactions/boostingViews";
import ServiceViews from "@/views/transactions/serviceViews";
import TribePaymentViews from "@/views/transactions/tribeViews";
import EventViews from "@/views/transactions/eventViews";
import PromotionViews from "@/views/transactions/promotionViews";
import AllPaymentsViews from "@/views/transactions/AllPaymentsViews";
import LedgerViews from "@/views/transactions/LedgerViews";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTransactionDataQuery } from "@/features/transaction/queries";
import { transactionApi, type TransactionListType } from "@/features/transaction/api";
import { manualTransactionsExport } from "@/utils/helper";
import useSearchParams from "@/hooks/useSearchParams";
import dayjs from "dayjs";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import useDebounce from "@/hooks/useDebounce";
import { SearchIcon } from "lucide-react";
import { transactionStatus } from "@/utils/helper";

const PER_PAGE = 10;

// Status words each tab can filter by; the backend maps them to its own values.
const STATUS_OPTIONS: Record<string, string[]> = {
  "plan-subscriptions": ["active", "inactive"],
  "wallet-withdrawals": ["pending", "successful", "rejected"],
  boosting: ["successful", "failed", "pending"],
  "tribe-payments": ["successful", "failed", "pending"],
  services: ["successful", "failed", "pending"],
  promotions: ["successful", "failed", "pending"],
  events: [],
};

function TransactionsClient() {
  const [menuOption, setMenuOption] = useState("plan-subscriptions");
  const [range, setRange] = useState<DateRange | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const { debouncedValue: search } = useDebounce(searchTerm, 500);
  const from = range ? dayjs(range.start).format("YYYY-MM-DD") : undefined;
  const to = range ? dayjs(range.end).format("YYYY-MM-DD") : undefined;
  // These two tabs run their own queries and filters.
  const isStandaloneTab = menuOption === "all-payments" || menuOption === "ledger";
  const { searchParams, setSearchParams } = useSearchParams();
  const page = Number(searchParams?.get("page") ?? 1);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: trxData } = useTransactionDataQuery(menuOption, {
    enabled: isLoggedIn && !isStandaloneTab,
    page,
    perPage: PER_PAGE,
    from,
    to,
    status: status || undefined,
    search: search.trim() || undefined,
  });

  const switchOption = (option: string) => {
    setMenuOption(option);
    setStatus("");
    setSearchParams({ page: undefined }); // reset to page 1 on tab switch
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
  };

  const renderViews = () => {
    switch (menuOption) {
      case "all-payments":
        return <AllPaymentsViews />;
      case "ledger":
        return <LedgerViews />;
      case "plan-subscriptions":
        return <PlansViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "wallet-withdrawals":
        return <WalletViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "boosting":
        return <BoostingViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "tribe-payments":
        return <TribePaymentViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "services":
        return <ServiceViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "events":
        return <EventViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "promotions":
        return <PromotionViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
    }
  };

  // trxData is paginated now — export needs every row, not just the
  // current page, so this fetches its own unpaginated copy on demand
  // (omitting page/perPage gets the old full-array shape back, see
  // docs/ARCHITECTURE.md §22 Conflict 1) rather than reusing trxData.
  const exportCSV = async () => {
    const fullData = await transactionApi.getTransactionData(menuOption as TransactionListType, {
      from,
      to,
      status: status || undefined,
      search: search.trim() || undefined,
    });
    manualTransactionsExport(fullData?.history || [], menuOption);
  };

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className={"flex justify-between px-5"}>
        <p className={"font-semiBold text-body-l"}>
          {isStandaloneTab
            ? "Transactions"
            : `${(trxData?.meta?.total ?? trxData?.history?.length ?? 0).toLocaleString()} Transactions`}
        </p>
        <div className={"flex justify-between gap-3"}>
          {isStandaloneTab ? null : (
            <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 shrink-0 items-center gap-3 rounded-xl border p-2 px-3">
              <SearchIcon className={"text-grey-40 h-3 w-3"} />
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchParams({ page: undefined });
                }}
                className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search transaction, ID..."
              />
            </div>
          )}
          {!isStandaloneTab && (STATUS_OPTIONS[menuOption] ?? []).length > 0 && (
            <select
              aria-label="Filter by status"
              className={"bg-light-grey h-10 rounded-xl px-3"}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setSearchParams({ page: undefined });
              }}
            >
              <option value="">Status</option>
              {(STATUS_OPTIONS[menuOption] ?? []).map((option) => (
                <option key={option} value={option}>
                  {transactionStatus(option).label}
                </option>
              ))}
            </select>
          )}
          {isStandaloneTab ? null : (
            <DateRangePicker
              value={range}
              onChange={(value) => {
                setRange(value);
                setSearchParams({ page: undefined });
              }}
            />
          )}
          <div className={isStandaloneTab ? "hidden" : undefined}>
            <Button
              onClick={exportCSV}
              className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
            >
              <UploadIcon className={"h-3.75 w-3.75 text-white"} />
              <p className={"text-body-l font-medium text-white"}>Export</p>
            </Button>
          </div>
        </div>
      </div>
      <div className={"flex flex-col px-5"}>
        <div className={"border-grey-20 flex flex-col rounded-xl border"}>
          <div className={"w-fit px-3 pt-2"}>
            <div className={"bg-mid-grey flex items-center gap-6 rounded-xl p-1"}>
              {transactionPageViews.map((item, index) => (
                <div
                  className={`cursor-pointer p-1 px-2 ${
                    menuOption === item.key && "rounded-lg bg-white"
                  }`}
                  onClick={() => switchOption(item.key)}
                  key={index}
                >
                  <p
                    className={`font-sans leading-6 ${
                      menuOption === item.key
                        ? "text-body-l font-semibold"
                        : "font-semi-normal text-text-grey text-body-l"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {renderViews()}
        </div>
      </div>
    </section>
  );
}

export default TransactionsClient;
