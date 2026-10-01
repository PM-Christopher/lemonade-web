import React from "react";
import TribeCard from "@/components/tribes/TribeCard";
import type { AccountInfoResponse } from "@/features/user/api";

interface TribeViewsProps {
  userDetail: AccountInfoResponse | undefined;
}

const TribeViews = ({ userDetail }: TribeViewsProps) => {
  return (
    <div className={"flex flex-col py-[20px]"}>
      {userDetail?.tribes?.map((item) => (
        <TribeCard
          date={item?.created_at}
          image={item?.image ?? ""}
          title={item?.name}
          key={item?.id}
          category={item?.category}
          members={String(item?.members ?? 0)}
          threads={String(item?.threads ?? 0)}
        />
      ))}
      {/* <TribeCard  />
            <TribeCard />
            <TribeCard /> */}
    </div>
  );
};

export default TribeViews;
