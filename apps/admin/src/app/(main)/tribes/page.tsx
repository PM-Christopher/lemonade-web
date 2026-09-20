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
import { CalendarIcon, ChevronDown, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
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
          <p className={"text-[16px] font-semiBold"}>
            {tribeListData?.tribes.length ?? 0} Tribes
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div className="bg-light_grey flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] border-grey-20 p-2 px-[12px]">
              <div>
                <SearchIcon className={"h-[12px] w-[12px] text-grey-40"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="w-full rounded-xl bg-light-grey py-4 text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder="Search Tribe, ID..."
                />
              </div>
            </div>

            <div
              className={
                "flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"h-[15px] w-[15px] text-text-grey"} />
                <p className={"text-[12px] font-semiBold text-text-grey"}>ALL TIME</p>
              </div>
              <ChevronDown className={"w-[20px] text-text-grey"} />
            </div>
            <div>
              <Button
                className={"flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"}
                onClick={toggleCreateTribeModal}
              >
                <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>Create Tribe</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col gap-[8px] px-[20px]"}>
          <div className={"flex flex-col rounded-[12px] border-[1px] border-grey-20"}>
            <div className={"w-fit px-[12px] pt-[8px]"}>
              <div className={"flex items-center gap-6 rounded-[12px] bg-mid-grey p-[4px]"}>
                {tribeViews.map((item, index) => (
                  <div
                    className={`cursor-pointer p-[4px] px-[8px] ${menuOption === item.key && "rounded-[10px] bg-white"}`}
                    onClick={() => switchOption(item.key)}
                    key={index}
                  >
                    <p
                      className={`font-sans leading-[24px] ${menuOption === item.key ? "text-[16px] font-semibold" : "font-semi-normal text-[16px] text-text-grey"}`}
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
