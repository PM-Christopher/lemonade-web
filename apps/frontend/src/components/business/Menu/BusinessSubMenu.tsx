import React from "react";
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import BriefCaseIcon from "@/images/icons/caseIcon.svg";

type BusinessSubMenuInterface = {
  toggle: () => void;
  toggleBusiness: () => void;
};

const BusinessSubMenu: React.FC<BusinessSubMenuInterface> = ({ toggle, toggleBusiness }) => {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="bg-light_grey flex h-10 w-58.75 items-center gap-3 rounded-xl p-2 px-3">
        <div>
          <SearchIcon />
        </div>
        <div>
          <input
            id="search"
            type="text"
            className="bg-light_grey text-body-s rounded-xl border-0 focus:border-transparent focus:ring-0 focus:outline-none"
            placeholder="Search business..."
          />
        </div>
      </div>
      <FilterIcon className="h-5.25 w-5.25 cursor-pointer" onClick={toggleBusiness} />
      <div
        className="laptop:border laptop:border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border-0 p-2 px-3.5"
        onClick={toggle}
      >
        <BriefCaseIcon className="h-5.25 w-5.25" />
        <p className="font-semi-normal text-black-light laptop:block text-body-l hidden font-sans">
          Jobs
        </p>
      </div>
    </div>
  );
};

export default BusinessSubMenu;
