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
    <div className="flex items-center justify-between gap-2.5 px-4">
      <div className="bg-light_grey laptop:w-[235px] flex h-10 w-[307px] items-center gap-3 rounded-xl p-2 px-3">
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
        className="border-light-grey-50 laptop:flex hidden cursor-pointer items-center gap-2 rounded-xl border p-2 px-3.5"
        onClick={toggleMenu}
      >
        <TicketIcon />
        <p className="font-semi-normal text-black-light font-sans text-[16px]">Tickets</p>
      </div>
    </div>
  );
};

export default EventSubMenu;
