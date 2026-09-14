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
      <div className="flex h-[40px] w-[307px] items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px] laptop:w-[235px]">
        <div>
          <SearchIcon />
        </div>
        <div>
          <input
            id="search"
            type="text"
            className="rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleEventSearch}
          />
        </div>
      </div>
      <FilterIcon className="h-[17.5px] w-[19.25px] cursor-pointer" onClick={filterEvent} />
      <div
        className="hidden cursor-pointer items-center gap-2 rounded-[12px] border-[1px] border-light-grey-50 p-[8px] px-[14px] laptop:flex"
        onClick={toggleMenu}
      >
        <TicketIcon />
        <p className="font-sans text-[16px] font-semi-normal text-black-light">Tickets</p>
      </div>
    </div>
  );
};

export default EventSubMenu;
