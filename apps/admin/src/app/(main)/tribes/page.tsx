"use client";
import MainLayout from "@/components/layouts/MainLayout";
import { RequirePermission } from "@/components/global/RequirePermission";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import { Button } from "@lemonade/ui";
import CreateTribeModal from "@/modals/tribes/CreateTribeModal";
import { tribeViews } from "@/utils/pageViews";
import CreatedTribeViews from "@/views/tribes/CreatedViews";
import TlnTribeViews from "@/views/tribes/TlnViews";
import { useTribeListQuery } from "@/features/tribes/queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CalendarIcon, ChevronDown, PlusIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";

const TribePage = () => {
  const [menuOption, setMenuOption] = useState("created");
  const [isCreateTribeModalOpen, setIsCreateTribeModalOpen] = useState(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // Shares the "created" tab's query cache (same key) — CreatedTribeViews
  // reads the same list, this just needs the count for the header.
  const { data: tribeListData } = useTribeListQuery({ enabled: isLoggedIn });

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const toggleCreateTribeModal = () => {
    setIsCreateTribeModalOpen(!isCreateTribeModalOpen);
  };

  const renderViews = () => {
    switch (menuOption) {
      case "created":
        return <CreatedTribeViews />;
      case "tln":
        return <TlnTribeViews />;
      default:
        <> </>;
    }
  };
  return (
    <RequirePermission permission={ADMIN_SECTION_PERMISSIONS.tribes}>
      <MainLayout>
        <section className="flex flex-col gap-[20px]">
          <div className={"flex justify-between px-[20px]"}>
            <p className={"font-semiBold text-[16px]"}>
              {tribeListData?.tribes.length ?? 0} Tribes
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
                    placeholder="Search Tribe, ID..."
                  />
                </div>
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
              <div>
                <Button
                  className={"border-step-color bg-gradient-green flex h-[40px] rounded-[12px]"}
                  onClick={toggleCreateTribeModal}
                >
                  <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                  <p className={"text-[16px] font-medium text-white"}>Create Tribe</p>
                </Button>
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[8px] px-[20px]"}>
            <div className={"border-grey-20 flex flex-col rounded-[12px] border-[1px]"}>
              <div className={"w-fit px-[12px] pt-[8px]"}>
                <div className={"bg-mid-grey flex items-center gap-6 rounded-[12px] p-[4px]"}>
                  {tribeViews.map((item, index) => (
                    <div
                      className={`cursor-pointer p-[4px] px-[8px] ${menuOption === item.key && "rounded-[10px] bg-white"}`}
                      onClick={() => switchOption(item.key)}
                      key={index}
                    >
                      <p
                        className={`font-sans leading-[24px] ${menuOption === item.key ? "text-[16px] font-semibold" : "font-semi-normal text-text-grey text-[16px]"}`}
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
        <CreateTribeModal isOpen={isCreateTribeModalOpen} toggle={toggleCreateTribeModal} />
      </MainLayout>
    </RequirePermission>
  );
};

export default TribePage;
