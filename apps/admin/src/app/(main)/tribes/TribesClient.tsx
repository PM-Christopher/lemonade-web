"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import CreateTribeModal from "@/modals/tribes/CreateTribeModal";
import { tribeViews } from "@/utils/pageViews";
import TribeListView, { type TribeListFilter } from "@/views/tribes/TribeListView";
import DeletionRequestsView from "@/views/tribes/DeletionRequestsView";
import { useTribeListQuery } from "@/features/tribes/queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PlusIcon, SearchIcon } from "lucide-react";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import React, { useState } from "react";

// Tribe list tabs, count and the create-tribe modal.
const TribesClient = () => {
  const [menuOption, setMenuOption] = useState("created");
  const [isCreateTribeModalOpen, setIsCreateTribeModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState<DateRange | null>(null);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // Same cache as the "created" tab; only the count is read here.
  const { data: tribeListData } = useTribeListQuery({ enabled: isLoggedIn });

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const toggleCreateTribeModal = () => {
    setIsCreateTribeModalOpen(!isCreateTribeModalOpen);
  };

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>{tribeListData?.tribes.length ?? 0} Tribes</p>
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
                  placeholder="Search Tribe, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                aria-label="Filter by status"
                className="font-semiBold text-text-grey text-meta h-10 w-40 rounded-xl leading-normal"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="RESTRICTED">Restricted</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker value={range} onChange={setRange} />
            <div>
              <Button
                className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
                onClick={toggleCreateTribeModal}
              >
                <PlusIcon className={"h-3.75 w-3.75 text-white"} />
                <p className={"text-body-l font-medium text-white"}>Create Tribe</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col gap-2 px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className={"w-fit px-3 pt-2"}>
              <div className={"bg-mid-grey flex items-center gap-6 rounded-xl p-1"}>
                {tribeViews.map((item, index) => (
                  <div
                    className={`cursor-pointer p-1 px-2 ${menuOption === item.key && "rounded-lg bg-white"}`}
                    onClick={() => switchOption(item.key)}
                    key={index}
                  >
                    <p
                      className={`font-sans leading-6 ${menuOption === item.key ? "text-body-l font-semibold" : "font-semi-normal text-text-grey text-body-l"}`}
                    >
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {menuOption === "deletions" ? (
              <DeletionRequestsView />
            ) : (
              <TribeListView
                key={menuOption}
                filter={menuOption as TribeListFilter}
                search={search}
                status={status}
                range={range}
              />
            )}
          </div>
        </div>
      </section>
      <CreateTribeModal isOpen={isCreateTribeModalOpen} toggle={toggleCreateTribeModal} />
    </>
  );
};

export default TribesClient;
