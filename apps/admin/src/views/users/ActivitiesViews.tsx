import React from "react";
import type { AccountInfoResponse } from "@/features/user/api";

interface ActivitiesViewsProps {
  userDetail: AccountInfoResponse | undefined;
}

function ActivitiesViews({ userDetail }: ActivitiesViewsProps) {
  return (
    <>
      <div className={"flex flex-col py-5"}>
        {/* <div className={"px-6 py-4"}>
                    <div
                        className={"flex border border-grey-20 h-10 rounded-xl justify-between items-center bg-light-grey px-4 py-2.5"}>
                        <div className={'flex justify-between items-center'}>
                            <div className={"flex gap-2 items-center text-text-grey"}>
                                <CalendarIcon className={"w-3.75"}/>
                                <p className={"text-meta leading-normal font-semiBold text-text-grey"}>
                                    ALL TIME
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={"text-text-grey w-5"}/>
                    </div>
                </div> */}

        <div className="pt-4 pb-6">
          <div className={"flex flex-col"}>
            {userDetail?.logs?.map((item) => (
              <div className="flex justify-between px-6 py-4" key={item?.id}>
                <p className={"text-light-black text-body-s font-medium"}>{item?.message}</p>
                <p className={"text-text-grey text-body-s font-normal"}>{item?.created_at}</p>
              </div>
            ))}

            {/* <div className="flex justify-between px-6 py-4">
              <p className={"font-medium text-body-s text-light-black"}>
                Created a 'Nigeria start-ups' Tribe
              </p>
              <p className={"text-text-grey font-normal text-body-s"}>
                Mon, 23 Mar, 2024 05:00PM
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivitiesViews;
