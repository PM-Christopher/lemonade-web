"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAdminProfileQuery } from "@/features/profile/queries";

function ProfilePage({}) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useAdminProfileQuery({ enabled: isLoggedIn });
  const profile = data?.admin;

  return (
    <MainLayout>
      <section className={"flex justify-between p-[20px]"}>
        <div className={"flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"}>
          <div className={"flex flex-col gap-[20px] p-[24px]"}>
            <div className={"h-[64px] w-[64px] rounded-full bg-mid-grey"}></div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Full Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.name}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>User ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.unique_id}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Status:</p>
              </div>
              <p className={"text-[14px] font-medium text-light-green-70"}>
                {profile?.status === 1 ? "Active" : "Suspended"}
              </p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Role:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{profile?.role.toUpperCase()}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Email Address:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{profile?.email}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Date Address:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.created_at}</p>
            </div>
            <button
              className={
                "w-fit rounded-[12px] border-[1px] border-light-grey-50 px-[48px] py-[11px] font-sans text-[14px] font-medium"
              }
              type={"button"}
            >
              Update password
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProfilePage;
