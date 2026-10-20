import React from "react";
import SearchIcon from "@/images/icons/search.svg";
import FilterIcon from "@/images/icons/fIlter.svg";
import BriefCaseIcon from "@/images/icons/caseIcon.svg";

type BusinessSubMenuInterface = {
  toggle: () => void;
  toggleBusiness: () => void;
  search: string;
  onSearch: (value: string) => void;
  filterActive: boolean;
};

const BusinessSubMenu: React.FC<BusinessSubMenuInterface> = ({
  toggle,
  toggleBusiness,
  search,
  onSearch,
  filterActive,
}) => {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl p-2 px-3 sm:w-58.75">
        <SearchIcon className="shrink-0" />
        <input
          id="search"
          type="text"
          aria-label="Search businesses"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="bg-light_grey text-body-s w-full rounded-xl border-0 focus:border-transparent focus:ring-0 focus:outline-none"
          placeholder="Search business..."
        />
      </div>
      <button
        type="button"
        aria-label="Filter businesses"
        className="relative shrink-0 cursor-pointer"
        onClick={toggleBusiness}
      >
        <FilterIcon className="h-5.25 w-5.25" />
        {filterActive && (
          <span className="bg-step-color absolute -top-1 -right-1 h-2 w-2 rounded-full" />
        )}
      </button>
      <button
        type="button"
        aria-label="Jobs"
        className="laptop:border laptop:border-light-grey-50 flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border-0 p-2 px-3.5"
        onClick={toggle}
      >
        <BriefCaseIcon className="h-5.25 w-5.25" />
        <p className="font-semi-normal text-black-light laptop:block text-body-l hidden font-sans">
          Jobs
        </p>
      </button>
    </div>
  );
};

export default BusinessSubMenu;
