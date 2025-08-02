import React from 'react';
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import TicketIcon from "@/images/icons/tickets.svg";
import BriefCaseIcon from "@/images/icons/caseIcon.svg"

type BusinessSubMenuInterface = {
    toggle: () => void
}

const BusinessSubMenu: React.FC<BusinessSubMenuInterface> = ({ toggle }) => {
    return (
        <div className="flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-[235px] h-[40px]">
                <div>
                    <SearchIcon/>
                </div>
                <div>
                    <input
                        id="search"
                        type="text"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        placeholder="Search business..."
                    />
                </div>
            </div>
            <FilterIcon className="w-[21px] h-[21px]" />
            <div
                className="border-0 laptop:border-[1px] p-[8px] px-[14px] gap-2 flex items-center laptop:border-light-grey-50 rounded-[12px] cursor-pointer" onClick={toggle}>
                <BriefCaseIcon className="w-[21px] h-[21px]"/>
                <p className="font-sans font-semi-normal text-[16px] text-black-light hidden laptop:block">Jobs</p>
            </div>
        </div>
    );
}

export default BusinessSubMenu;