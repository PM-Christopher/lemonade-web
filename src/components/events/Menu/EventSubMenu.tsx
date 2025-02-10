"use client"
import React from 'react';
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import TicketIcon from "@/images/icons/tickets.svg";

type EventSubMenuInterface = {
    toggleMenu: () => void,
    searchTerm: string,
    handleEventSearch: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const EventSubMenu: React.FC<EventSubMenuInterface> = ({toggleMenu, searchTerm, handleEventSearch}) => {


    return (
        <div className="flex justify-between px-[16px] items-center gap-[10px]">
            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-[307px] h-[40px] laptop:w-[235px]">
                <div>
                    <SearchIcon/>
                </div>
                <div>
                    <input
                        id="search"
                        type="text"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={handleEventSearch}
                    />
                </div>
            </div>
            <FilterIcon className="w-[19.25px] h-[17.5px]"/>
            <div
                className="border-[1px] p-[8px] px-[14px] gap-2 items-center border-light-grey-50 rounded-[12px] cursor-pointer hidden laptop:flex"
                onClick={toggleMenu}>
                <TicketIcon/>
                <p className="font-sans font-semi-normal text-[16px] text-black-light">Tickets</p>
            </div>
        </div>
    );
}

export default EventSubMenu;