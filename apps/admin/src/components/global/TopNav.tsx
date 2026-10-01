import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords, getFirstLetterCapitalized } from "@/utils/helper";
import { UserInterface } from "@/interfaces/SystemInterface";

function TopNav({}) {
  const user: UserInterface | null = useSelector((state: RootState) => state.auth.user);
  return (
    <header className="border-b-grey-20 flex items-center justify-between border-b bg-white px-5 py-5">
      <h1 className="font-semiBold text-[16px]">Overview</h1>
      <div className="flex items-center space-x-4">
        <div className={"flex flex-col items-end"}>
          <p className={"font-semiBold text-[16px]"}>{user?.name}</p>
          <p className={"text-text-grey text-[12px] font-normal"}>{capitalizeWords(user?.role)}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
          {getFirstLetterCapitalized(user?.name)}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
