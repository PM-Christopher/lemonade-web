"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import PadlockIcon from "@/images/icons/padlockIcon.svg";
import { Loader2 } from "lucide-react";
import ChevronRight from "@/images/icons/chevronRight.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import LogoutIcon from "@/images/icons/logoutIcon.svg";
import dynamic from "next/dynamic";

import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

// Lazy-loaded; only needed once "Update Password" is clicked.
const UpdatePasswordModal = dynamic(
  () => import("@/components/settings/Modal/UpdatePasswordModal"),
  { ssr: false },
);

// Account actions: update password, delete account, log out.
const AccountSettingsClient = () => {
  const dispatch = useAppDispatch();
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const { push } = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const logoutMutation = useLogoutMutation();

  const toggleSettingsModal = () => {
    setPasswordModalOpen(!isPasswordModalOpen);
  };

  const handleLogout = () => {
    // useLogoutMutation clears local session state even if the request fails.
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
        push(routes.LOGIN);
      },
    });
  };

  const settingsItems = [
    {
      id: "update-password",
      icon: <PadlockIcon />,
      label: "Update Password",
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
    {
      id: "logout",
      icon: <LogoutIcon />,
      label: "Log out",
      onClick: handleLogout,
      textColor: "text-red-1",
    },
  ];

  return (
    <>
      <section className="mt-4 flex flex-col items-center px-5">
        <div className="laptop:w-160 flex w-full flex-col gap-4 rounded-xl bg-white p-4">
          {settingsItems.map((item) => {
            const isBusy = item.id === "logout" && logoutMutation.isPending;
            return (
              <div
                key={item.id}
                className="-m-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
                onClick={isBusy ? undefined : item.onClick}
                aria-busy={isBusy || undefined}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <p className={`text-body-l font-normal ${item.textColor}`}>{item.label}</p>
                </div>
                {isBusy ? (
                  <Loader2 className="animate-spin text-gray-400" aria-hidden="true" />
                ) : (
                  <ChevronRight className="text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </section>
      <UpdatePasswordModal user={user} toggle={toggleSettingsModal} isOpen={isPasswordModalOpen} />
    </>
  );
};

export default AccountSettingsClient;
