import React from 'react';
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import TicketIcon from "@/images/icons/tickets.svg";

type EventSubMenuInterface = {
    toggleMenu: () => void,
}

const EventSubMenu: React.FC<EventSubMenuInterface> = ({toggleMenu}) => {
    return (
        <div className="flex gap-4 items-center">
            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-[235px]">
                <div>
                    <SearchIcon/>
                </div>
                <div>
                    <input
                        id="search"
                        type="text"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        placeholder="Search events..."
                    />
                </div>
            </div>
            <FilterIcon/>
            <div
                className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                onClick={toggleMenu}>
                <TicketIcon/>
                <p className="font-sans font-semi-normal text-[16px] text-black-light">Tickets</p>
            </div>
        </div>
    );
}

export default EventSubMenu;