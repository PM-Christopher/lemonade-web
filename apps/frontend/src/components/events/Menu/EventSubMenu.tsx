"use client";
import React from "react";
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import TicketIcon from "@/images/icons/tickets.svg";

type EventSubMenuInterface = {
  toggleMenu: () => void;
  filterEvent: () => void;
  searchTerm: string;
  handleEventSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EventSubMenu: React.FC<EventSubMenuInterface> = ({
  toggleMenu,
  searchTerm,
  handleEventSearch,
  filterEvent,
}) => {
  return (
    <div className="flex items-center justify-between gap-[10px] px-[16px]">
      <div className="bg-light_grey laptop:w-[235px] flex h-[40px] w-[307px] items-center gap-3 rounded-[12px] p-2 px-[12px]">
        <div>
          <SearchIcon />
        </div>
        <div>
          <input
            id="search"
            type="text"
            className="bg-light_grey rounded-xl border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleEventSearch}
          />
        </div>
      </div>
      <FilterIcon className="h-[17.5px] w-[19.25px] cursor-pointer" onClick={filterEvent} />
      <div
        className="border-light-grey-50 laptop:flex hidden cursor-pointer items-center gap-2 rounded-[12px] border-[1px] p-[8px] px-[14px]"
        onClick={toggleMenu}
      >
        <TicketIcon />
        <p className="font-semi-normal text-black-light font-sans text-[16px]">Tickets</p>
      </div>
    </div>
  );
};

export default EventSubMenu;
