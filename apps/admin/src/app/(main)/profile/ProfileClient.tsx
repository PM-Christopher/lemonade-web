"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAdminProfileQuery } from "@/features/profile/queries";

function ProfileClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useAdminProfileQuery({ enabled: isLoggedIn });
  const profile = data?.admin;

  return (
    <MainLayout>
      <section className={"flex justify-between p-5"}>
        <div className={"flex h-fit w-[588px] flex-col gap-3 rounded-xl bg-white"}>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"bg-mid-grey h-16 w-16 rounded-full"}></div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.name}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.unique_id}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
              </div>
              <p className={"text-light-green-70 text-[14px] font-medium"}>
                {profile?.status === 1 ? "Active" : "Suspended"}
              </p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{profile?.role.toUpperCase()}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{profile?.email}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Date Address:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{profile?.created_at}</p>
            </div>
            <button
              className={
                "border-light-grey-50 w-fit rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
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

export default ProfileClient;
