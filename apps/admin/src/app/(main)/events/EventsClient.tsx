"use client";
import React, { useEffect, useState } from "react";
import AffiliateView from "@/views/events/AffiliateView";
import { CalendarIcon, ChevronDown, SearchIcon, UploadIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { eventViews } from "@/utils/pageViews";
import EventView from "@/views/events/EventView";
import PromotionView from "@/views/tribes/PromotionView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEventListQuery } from "@/features/events/queries";
import { useExportCsvMutation } from "@/features/exports/mutations";
import { downloadCSV } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { Button } from "@lemonade/ui";
import useDebounce from "@/hooks/useDebounce";
import useSearchParams from "@/hooks/useSearchParams";

const EventsClient = () => {
  const [menuOption, setMenuOption] = useState("events");
  const dispatch = useDispatch<AppDispatch>();
  const [searchValue, setSearchValue] = useState("");

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
        return <EventView pageData={eventData} />;
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
    // setSearchParams's identity changes on every navigation (it depends on
    // useSearchParams()'s live searchParams — see hooks/useSearchParams.ts),
    // so including it here would re-run this effect after every push and
    // push again, in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"font-semiBold text-[16px]"}>
            {(eventData && "events" in eventData ? eventData.events.length : 0) || 6} Events
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div className="bg-light_grey border-grey-20 flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] p-2 px-[12px]">
              <div>
                <SearchIcon className={"text-grey-40 h-[12px] w-[12px]"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light-grey w-full rounded-xl py-4 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search event, ID..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                "border-grey-20 flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center justify-between"}>
                <p className={"font-semiBold text-text-grey text-[12px]"}>STATUS</p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div>
            <div
              className={
                "border-grey-20 flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"text-text-grey h-[15px] w-[15px]"} />
                <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div>

            {menuOption === "events" && (
              <>
                <div>
                  <Button
                    onClick={exportFunc}
                    className={"border-step-color bg-gradient-green flex h-[40px] rounded-[12px]"}
                  >
                    <UploadIcon className={"h-[15px] w-[15px] text-white"} />
                    <p className={"text-[16px] font-medium text-white"}>
                      {isLoading ? "Exporting..." : "Export"}
                    </p>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"border-grey-20 flex flex-col rounded-[12px] border-[1px]"}>
            <div className={"w-fit px-[12px] pt-[8px]"}>
              <div className={"bg-mid-grey flex items-center gap-6 rounded-[12px] p-[4px]"}>
                {eventViews.map((item, index) => (
                  <div
                    className={`cursor-pointer p-[4px] px-[8px] ${
                      menuOption === item.key && "rounded-[10px] bg-white"
                    }`}
                    onClick={() => switchOption(item.key)}
                    key={index}
                  >
                    <p
                      className={`font-sans leading-[24px] ${
                        menuOption === item.key
                          ? "text-[16px] font-semibold"
                          : "font-semi-normal text-text-grey text-[16px]"
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
