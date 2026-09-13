"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PadlockIcon from "@/images/icons/padlockIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import LogoutIcon from "@/images/icons/logoutIcon.svg";
import UpdatePasswordModal from "@/components/settings/Modal/UpdatePasswordModal";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";

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
          })
        );
      },
      onSettled: () => {
        router.push("/login");
      },
    });
  };


  const settingsItems = [
  {
    id: 'update-password',
    icon: <PadlockIcon />,
    label: 'Update Password',
    onClick: toggleSettingsModal,
    textColor: 'text-black' // or your default text color
  },
  {
    id: 'delete-account',
    icon: <TrashIcon />,
    label: 'Delete account',
    onClick: () => router.push("/settings/account/delete-account"),
    textColor: 'text-black'
  },
  {
    id: 'logout',
    icon: <LogoutIcon />,
    label: 'Log out',
    onClick: handleLogout,
    textColor: 'text-red-1'
  }
];


  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Account settings
            </p>
          </div>
        </div>
       <section className="mt-4 flex flex-col px-5 items-center">
  <div className="w-full laptop:w-[640px] rounded-[12px] p-[16px] flex flex-col bg-white gap-4">
    {settingsItems.map((item, index) => (
      <div 
        key={item.id}
        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
        onClick={item.onClick}
      >
        <div className="flex gap-[8px] items-center">
          {item.icon}
          <p className={`font-normal text-[16px] ${item.textColor}`}>
            {item.label}
          </p>
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
