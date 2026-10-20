"use client";
import React, { useEffect, useState } from "react";
import AffiliateView from "@/views/events/AffiliateView";
import { SearchIcon, UploadIcon } from "lucide-react";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import MainLayout from "@/components/layouts/MainLayout";
import { eventViews } from "@/utils/pageViews";
import EventView from "@/views/events/EventView";
import PendingEventsView from "@/views/events/PendingEventsView";
import PromotionView from "@/views/tribes/PromotionView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEventListQuery } from "@/features/events/queries";
import { useExportCsvMutation } from "@/features/exports/mutations";
import { capitalizeWords, downloadCSV } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { Button } from "@lemonade/ui";
import useDebounce from "@/hooks/useDebounce";
import useSearchParams from "@/hooks/useSearchParams";

const EVENT_STATUSES = [
  "active",
  "pending",
  "rejected",
  "suspended",
  "closed",
  "draft",
  "inactive",
];

const EventsClient = () => {
  const { searchParams } = useSearchParams();
  // The dashboard links here with ?tab=pending.
  const [menuOption, setMenuOption] = useState(
    searchParams?.get("tab") === "pending" ? "pending" : "events",
  );
  const dispatch = useDispatch<AppDispatch>();
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [range, setRange] = useState<DateRange | null>(null);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: eventData } = useEventListQuery(menuOption, {
    enabled: isLoggedIn,
  });
  const [isLoading, setLoading] = useState(false);
  const exportCsv = useExportCsvMutation();
  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const renderViews = () => {
    switch (menuOption) {
      case "events":
        return <EventView pageData={eventData} status={status} range={range} />;
      case "pending":
        return <PendingEventsView pageData={eventData} range={range} />;
      case "affiliates":
        return <AffiliateView pageData={eventData} />;
      case "promotions":
        return <PromotionView pageData={eventData} />;
      default:
        return <></>;
    }
  };

  const { debouncedValue } = useDebounce(searchValue, 500);
  const { setSearchParams } = useSearchParams();
  useEffect(() => {
    setSearchParams({ search: debouncedValue });
  }, [debouncedValue, setSearchParams]);

  const exportFunc = () => {
    setLoading(true);
    exportCsv.mutate("events", {
      onSuccess: (csv) => {
        setLoading(false);
        downloadCSV(csv, "events.csv");
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Downloaded `,
            type: "success",
          }),
        );
      },
      onError: (error) => {
        setLoading(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || `Something went wrong`,
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <MainLayout>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>
            {eventData && "events" in eventData ? eventData.events.length : 0} Events
          </p>
          <div className={"flex justify-between gap-3"}>
            <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 items-center gap-3 rounded-xl border p-2 px-3">
              <div>
                <SearchIcon className={"text-grey-40 h-3 w-3"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search event, ID..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            {menuOption === "events" && (
              <select
                aria-label="Filter by status"
                className={"bg-light-grey h-10 rounded-xl px-3"}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {EVENT_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {capitalizeWords(option)}
                  </option>
                ))}
              </select>
            )}
            <DateRangePicker value={range} onChange={setRange} />

            {menuOption === "events" && (
              <>
                <div>
                  <Button
                    onClick={exportFunc}
                    className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
                  >
                    <UploadIcon className={"h-3.75 w-3.75 text-white"} />
                    <p className={"text-body-l font-medium text-white"}>
                      {isLoading ? "Exporting..." : "Export"}
                    </p>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className={"w-fit px-3 pt-2"}>
              <div className={"bg-mid-grey flex items-center gap-6 rounded-xl p-1"}>
                {eventViews.map((item, index) => (
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
    </MainLayout>
  );
};
export default EventsClient;
