import React from "react";
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import TicketIcon from "@/images/icons/tickets.svg";
import BriefCaseIcon from "@/images/icons/caseIcon.svg";

type BusinessSubMenuInterface = {
  toggle: () => void;
  toggleBusiness: () => void;
};

const BusinessSubMenu: React.FC<BusinessSubMenuInterface> = ({ toggle, toggleBusiness }) => {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <div className="flex h-[40px] w-[235px] items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
        <div>
          <SearchIcon />
        </div>
        <div>
          <input
            id="search"
            type="text"
            className="rounded-xl border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Search business..."
          />
        </div>
      </div>
      <FilterIcon className="h-[21px] w-[21px] cursor-pointer" onClick={toggleBusiness} />
      <div
        className="flex cursor-pointer items-center gap-2 rounded-[12px] border-0 p-[8px] px-[14px] laptop:border-[1px] laptop:border-light-grey-50"
        onClick={toggle}
      >
        <BriefCaseIcon className="h-[21px] w-[21px]" />
        <p className="hidden font-sans text-[16px] font-semi-normal text-black-light laptop:block">
          Jobs
        </p>
      </div>
    </div>
  );
};

export default BusinessSubMenu;
