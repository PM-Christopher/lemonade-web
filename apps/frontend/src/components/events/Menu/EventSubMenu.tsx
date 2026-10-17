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
    <div className="flex items-center justify-between gap-2.5">
      <div className="bg-light_grey laptop:w-58.75 laptop:flex-none flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl px-3">
        <SearchIcon className="shrink-0" />
        <input
          id="search"
          type="text"
          aria-label="Search events"
          className="text-body-s min-w-0 flex-1 rounded-xl border-0 bg-transparent focus:border-transparent focus:ring-0 focus:outline-none"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleEventSearch}
        />
      </div>
      <button
        type="button"
        aria-label="Filter events"
        className="flex shrink-0 cursor-pointer"
        onClick={filterEvent}
      >
        <FilterIcon className="h-4.5 w-4.75" />
      </button>
      <div
        className="border-light-grey-50 laptop:flex hidden cursor-pointer items-center gap-2 rounded-xl border p-2 px-3.5"
        onClick={toggleMenu}
      >
        <TicketIcon />
        <p className="font-semi-normal text-black-light text-body-l font-sans">Tickets</p>
      </div>
    </div>
  );
};

export default EventSubMenu;
