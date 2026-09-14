import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords, getFirstLetterCapitalized } from "@/utils/helper";
import { UserInterface } from "@/interfaces/SystemInterface";

function TopNav({}) {
  const user: UserInterface | null = useSelector((state: RootState) => state.auth.user);
  return (
    <header className="flex items-center justify-between border-b-[1px] border-b-grey-20 bg-white px-[20px] py-[20px]">
      <h1 className="text-[16px] font-semiBold">Overview</h1>
      <div className="flex items-center space-x-4">
        <div className={"flex flex-col items-end"}>
          <p className={"text-[16px] font-semiBold"}>{user?.name}</p>
          <p className={"text-[12px] font-normal text-text-grey"}>{capitalizeWords(user?.role)}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
          {getFirstLetterCapitalized(user?.name)}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
