"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PadlockIcon from "@/images/icons/padlockIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import LogoutIcon from "@/images/icons/logoutIcon.svg";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";

// Off the initial bundle — only needed once "Change password" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const UpdatePasswordModal = dynamic(
  () => import("@/components/settings/Modal/UpdatePasswordModal"),
  { ssr: false },
);

const AccountSettingsPage = () => {
  const dispatch = useAppDispatch();
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const logoutMutation = useLogoutMutation();

  const toggleSettingsModal = () => {
    setPasswordModalOpen(!isPasswordModalOpen);
  };

  const handleLogout = () => {
    // Redux/query-cache cleanup happens in useLogoutMutation's onSettled
    // regardless of whether the backend call itself succeeds — see
    // features/authentication/mutations.ts.
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Logged out`,
            type: "success",
          }),
        );
      },
      onSettled: () => {
        router.push("/login");
      },
    });
  };

  const settingsItems = [
    {
      id: "update-password",
      icon: <PadlockIcon />,
      label: "Update Password",
      onClick: toggleSettingsModal,
      textColor: "text-black", // or your default text color
    },
    {
      id: "delete-account",
      icon: <TrashIcon />,
      label: "Delete account",
      onClick: () => router.push("/settings/account/delete-account"),
      textColor: "text-black",
    },
    {
      id: "logout",
      icon: <LogoutIcon />,
      label: "Log out",
      onClick: handleLogout,
      textColor: "text-red-1",
    },
  ];

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Account settings</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center px-5">
          <div className="laptop:w-[640px] flex w-full flex-col gap-4 rounded-[12px] bg-white p-[16px]">
            {settingsItems.map((item, index) => (
              <div
                key={item.id}
                className="-m-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-[8px]">
                  {item.icon}
                  <p className={`text-[16px] font-normal ${item.textColor}`}>{item.label}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            ))}
          </div>
        </section>
        <UpdatePasswordModal
          user={user}
          toggle={toggleSettingsModal}
          isOpen={isPasswordModalOpen}
        />
      </section>
    </MainLayout>
  );
};

export default AccountSettingsPage;
