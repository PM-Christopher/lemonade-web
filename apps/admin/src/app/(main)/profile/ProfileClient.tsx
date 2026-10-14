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
        <div className={"flex h-fit w-147 flex-col gap-3 rounded-xl bg-white"}>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"bg-mid-grey h-16 w-16 rounded-full"}></div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Full Name:</p>
              </div>
              <p className={"text-body-s font-medium"}>{profile?.name}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>User ID:</p>
              </div>
              <p className={"text-body-s font-medium"}>{profile?.unique_id}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Status:</p>
              </div>
              <p className={"text-light-green-70 text-body-s font-medium"}>
                {profile?.status === 1 ? "Active" : "Suspended"}
              </p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Role:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-body-s font-medium"}>{profile?.role.toUpperCase()}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Email Address:
                </p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-body-s font-medium"}>{profile?.email}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Date Address:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{profile?.created_at}</p>
            </div>
            <button
              className={
                "border-light-grey-50 text-body-s w-fit rounded-xl border px-12 py-2.75 font-sans font-medium"
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
