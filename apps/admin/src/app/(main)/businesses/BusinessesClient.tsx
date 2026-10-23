"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { useBusinessListQuery, useServiceListQuery } from "@/features/businesses/queries";
import type { BusinessFilters } from "@/features/businesses/api";
import useDebounce from "@/hooks/useDebounce";
import { BusinessListView } from "@/views/businesses/BusinessListView";
import { ServiceListView } from "@/views/businesses/ServiceListView";

const CommissionModal = dynamic(() => import("@/modals/businesses/CommissionModal"), {
  ssr: false,
});

type Tab = "businesses" | "services";

const TABS: { key: Tab; title: string }[] = [
  { key: "businesses", title: "Businesses" },
  { key: "services", title: "Services" },
];

const STATUS_OPTIONS: Record<Tab, { value: string; label: string }[]> = {
  businesses: [
    { value: "all", label: "All" },
    { value: "active", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Restricted" },
  ],
  services: [
    { value: "all", label: "All" },
    { value: "in-progress", label: "In-progress" },
    { value: "completed", label: "Completed" },
    { value: "in-dispute", label: "In-dispute" },
  ],
};

// Businesses and services tabs with shared search, status and date filters.
function BusinessesClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<Tab>("businesses");
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState<DateRange | null>(null);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const { debouncedValue: search } = useDebounce(searchTerm, 500);

  const filters: BusinessFilters = {
    status,
    search: search.trim() || undefined,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
  };

  const { data: businessData } = useBusinessListQuery(filters, {
    enabled: isLoggedIn && tab === "businesses",
  });
  const { data: serviceData } = useServiceListQuery(filters, {
    enabled: isLoggedIn && tab === "services",
  });
  const count =
    tab === "businesses"
      ? (businessData?.businesses.length ?? 0)
      : (serviceData?.services.length ?? 0);
  const commission = businessData?.commission_percentage ?? 0;

  const switchTab = (next: Tab) => {
    setTab(next);
    setStatus("all");
  };

  return (
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className="flex justify-between px-5">
          <p className="font-semiBold text-body-l">{count} Businesses</p>
          <div className="flex justify-between gap-3">
            <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 shrink-0 items-center gap-3 rounded-xl border p-2 px-3">
              <SearchIcon className="text-grey-40 h-3 w-3" />
              <input
                id="search"
                type="text"
                className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search business, ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                aria-label="Filter by status"
                className="font-semiBold text-text-grey text-meta h-10 w-40 rounded-xl leading-normal"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS[tab].map((option) => (
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
            <div className="w-fit max-w-full overflow-x-auto px-3 pt-2">
              <div className="bg-mid-grey flex items-center gap-6 rounded-xl p-1">
                {TABS.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={`shrink-0 cursor-pointer p-1 px-2 ${tab === item.key ? "rounded-lg bg-white" : ""}`}
                    onClick={() => switchTab(item.key)}
                  >
                    <span
                      className={`font-sans leading-6 whitespace-nowrap ${tab === item.key ? "text-body-l font-semibold" : "font-semi-normal text-text-grey text-body-l"}`}
                    >
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {tab === "businesses" ? (
              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-start justify-between rounded-xl bg-white p-5">
                  <div>
                    <p className="text-text-grey text-body-s font-normal">
                      Default commission (no plan)
                    </p>
                    <p className="text-body-xl mt-2 font-semibold">{commission}%</p>
                  </div>
                  <button
                    type="button"
                    className="text-body-s cursor-pointer font-medium"
                    onClick={() => setCommissionOpen(true)}
                  >
                    Edit
                  </button>
                </div>
                <BusinessListView filters={filters} />
              </div>
            ) : (
              <ServiceListView filters={filters} />
            )}
          </div>
        </div>
      </section>
      <CommissionModal
        isOpen={commissionOpen}
        toggle={() => setCommissionOpen(false)}
        current={commission}
      />
    </>
  );
}

export default BusinessesClient;
