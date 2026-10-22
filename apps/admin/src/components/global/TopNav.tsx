import React from "react";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords, getFirstLetterCapitalized } from "@/utils/helper";
import { getPageHeading } from "@/utils/pageTitle";
import { useNavigation } from "@/hooks/useNavigation";
import { UserInterface } from "@/interfaces/SystemInterface";

function TopNav({}) {
  const user: UserInterface | null = useSelector((state: RootState) => state.auth.user);
  const { pathname, back, push } = useNavigation();
  const { title, parent } = getPageHeading(pathname);

  // Go back one step, or up to the list when the page was opened directly.
  const goBack = () => {
    if (window.history.length > 1) back();
    else if (parent) push(parent);
  };

  return (
    <header className="border-b-grey-20 flex shrink-0 items-center justify-between border-b bg-white px-5 py-5">
      <div className="flex items-center gap-3">
        {parent && (
          <button
            type="button"
            aria-label="Go back"
            className="bg-light_grey flex h-7 w-7 cursor-pointer items-center justify-center rounded-full"
            onClick={goBack}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <h1 className="font-semiBold text-body-l">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className={"flex flex-col items-end"}>
          <p className={"font-semiBold text-body-l"}>{user?.name}</p>
          <p className={"text-text-grey text-meta leading-normal font-normal"}>
            {capitalizeWords(user?.role)}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
          {getFirstLetterCapitalized(user?.name)}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
