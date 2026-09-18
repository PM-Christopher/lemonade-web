"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  CalendarIcon,
  ChevronDown,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { Button } from "@lemonade/ui";
import { transactionPageViews } from "@/utils/pageViews";
import PlansViews from "@/views/transactions/PlansViews";
import WalletViews from "@/views/transactions/walletViews";
import BoostingViews from "@/views/transactions/boostingViews";
import ServiceViews from "@/views/transactions/serviceViews";
import EventViews from "@/views/transactions/eventViews";
import PromotionViews from "@/views/transactions/promotionViews";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTransactionDataQuery } from "@/features/transaction/queries";
import { transactionApi, type TransactionListType } from "@/features/transaction/api";
import { manualTransactionsExport } from "@/utils/helper";
import useSearchParams from "@/hooks/useSearchParams";

const PER_PAGE = 10;

function TransactionsClient() {
  const [menuOption, setMenuOption] = useState("plan-subscriptions");
  const { searchParams, setSearchParams } = useSearchParams();
  const page = Number(searchParams?.get("page") ?? 1);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: trxData } = useTransactionDataQuery(menuOption, {
    enabled: isLoggedIn,
    page,
    perPage: PER_PAGE,
  });

  const switchOption = (option: string) => {
    setMenuOption(option);
    setSearchParams({ page: undefined }); // reset to page 1 on tab switch
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
  };

  const renderViews = () => {
    switch (menuOption) {
      case "plan-subscriptions":
        return <PlansViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "wallet-withdrawals":
        return <WalletViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
      case "boosting":
        return <BoostingViews trx_data={trxData} page={page} onPageChange={handlePageChange} />;
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
    const fullData = await transactionApi.getTransactionData(menuOption as TransactionListType);
    manualTransactionsExport(fullData?.history || [], menuOption);
  };

  return (
    <MainLayout>
      <section className="mt-[20px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {/* subscribers (real subscriber count) still wins for plan-subscriptions
                — it's a different number from meta.total (total history rows),
                not just a fallback for it. */}
            {trxData?.subscribers ?? trxData?.meta?.total ?? trxData?.history?.length ?? 0} Transactions
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            {/* <div
                            className="flex items-center gap-3 bg-light_grey p-2 px-[12px] h-[40px] w-[285px] rounded-[12px] border-[1px] border-grey-20">
                            <div>
                                <SearchIcon className={"w-[12px] h-[12px] text-grey-40"}/>
                            </div>
                            <div className="w-full">
                                <input
                                    id="search"
                                    type="text"
                                    className="rounded-xl text-[14px] bg-light-grey focus:outline-none focus:ring-0 focus:border-transparent w-full py-4"
                                    placeholder="Search transactions, ID..."
                                />
                            </div>
                        </div> */}
            {/* <div
                            className={"flex border-[1px] border-grey-20 bg-none w-[193px] h-[40px] px-[16px] py-[10px] rounded-[12px] justify-between items-center"}>
                            <div className={'flex justify-between items-center'}>
                                <p className={"text-[12px] font-semiBold text-text-grey"}>
                                    STATUS
                                </p>
                            </div>
                            <ChevronDown className={"text-text-grey w-[20px]"}/>
                        </div> */}
            {/* <div
                            className={"flex border-[1px] border-grey-20 bg-none w-[193px] h-[40px] px-[16px] py-[10px] rounded-[12px] justify-between items-center"}>
                            <div className={'flex gap-2 items-center'}>
                                <CalendarIcon className={"text-text-grey w-[15px] h-[15px]"}/>
                                <p className={"text-[12px] font-semiBold text-text-grey"}>ALL TIME</p>
                            </div>
                            <ChevronDown className={"text-text-grey w-[20px]"}/>
                        </div> */}
            <div>
              <Button
                onClick={exportCSV}
                className={
                  "flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"
                }
              >
                <UploadIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>Export</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div
            className={
              "flex flex-col rounded-[12px] border-[1px] border-grey-20"
            }
          >
            <div className={"w-fit px-[12px] pt-[8px]"}>
              <div
                className={
                  "flex items-center gap-6 rounded-[12px] bg-mid-grey p-[4px]"
                }
              >
                {transactionPageViews.map((item, index) => (
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
                          : "font-semi-normal text-[16px] text-text-grey"
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
}

export default TransactionsClient;
