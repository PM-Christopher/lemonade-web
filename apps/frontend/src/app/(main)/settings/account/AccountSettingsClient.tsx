"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import PadlockIcon from "@/images/icons/padlockIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import dynamic from "next/dynamic";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

// Lazy-loaded; only needed once "Update password" is clicked.
const UpdatePasswordModal = dynamic(
  () => import("@/components/settings/Modal/UpdatePasswordModal"),
  { ssr: false },
);

// Account actions: update password and delete account.
const AccountSettingsClient = () => {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const { push } = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleSettingsModal = () => {
    setPasswordModalOpen(!isPasswordModalOpen);
  };

  const settingsItems = [
    {
      id: "update-password",
      icon: <PadlockIcon />,
      label: "Update password",
      onClick: toggleSettingsModal,
      textColor: "text-black",
    },
    {
      id: "delete-account",
      icon: <TrashIcon />,
      label: "Delete account",
      onClick: () => push(routes.SETTINGS_ACCOUNT_DELETE),
      textColor: "text-black",
    },
  ];

  return (
    <>
      <section className="mt-4 flex flex-col items-center px-5">
        <div className="laptop:w-160 flex w-full flex-col gap-4 rounded-xl bg-white p-4">
          {settingsItems.map((item) => (
            <div
              key={item.id}
              className="-m-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <p className={`text-body-l font-normal ${item.textColor}`}>{item.label}</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </section>
      <UpdatePasswordModal user={user} toggle={toggleSettingsModal} isOpen={isPasswordModalOpen} />
    </>
  );
};

export default AccountSettingsClient;
