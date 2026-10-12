"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import Image from "next/image";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import ProfileIcon from "@/images/icons/profileIcon.svg";
import GearIcon from "@/images/icons/settingsGearIcon.svg";
import PricingIcon from "@/images/icons/pricingIcon.svg";
import BillingIcon from "@/images/icons/billingIcon.svg";
import BellIcon from "@/images/icons/bellIcon.svg";
import WalletIcon from "@/images/icons/walletIcon.svg";
import ReferralIcon from "@/images/icons/referralIcon.svg";
import PaperIcon from "@/images/icons/paperIcon.svg";
import LogoutIcon from "@/images/icons/logoutIcon.svg";

import { useSelector } from "react-redux";
import { formatString, getInitials, splitLemonId } from "@/lib/helper";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";

type SettingsItem = {
  title: string;
  icon: React.ComponentType;
  path?: string;
  onClick?: () => void;
  textColor?: string;
};

const accountSettings: SettingsItem[] = [
  { title: "Profile settings", icon: ProfileIcon, path: routes.SETTINGS_PROFILE },
  { title: "Account settings", icon: GearIcon, path: routes.SETTINGS_ACCOUNT },
  { title: "Plan", icon: PricingIcon, path: routes.SETTINGS_PLAN },
  { title: "Billing History", icon: BillingIcon, path: routes.SETTINGS_BILLING_HISTORY },
  { title: "Notification settings", icon: BellIcon, path: routes.SETTINGS_NOTIFICATION },
];

const earnSettings: SettingsItem[] = [
  { title: "Wallet", icon: WalletIcon, path: routes.SETTINGS_WALLET },
  { title: "Referrals", icon: ReferralIcon, path: routes.SETTINGS_REFERRAL },
];

// Profile card and settings menu for the signed-in user.
function SettingsClient() {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Logged out",
            type: "success",
          }),
        );
      },
      onSettled: () => {
        push(routes.LOGIN);
      },
    });
  };

  const moreSettings: SettingsItem[] = [
    { title: "Terms and conditions", icon: PaperIcon, path: routes.SETTINGS_TERMS },
    { title: "Privacy policy", icon: PaperIcon, path: routes.SETTINGS_PRIVACY },
    {
      title: "Log out",
      icon: LogoutIcon,
      onClick: handleLogout,
      textColor: "text-red-1",
    },
  ];

  const openItem = (item: SettingsItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.path) push(item.path);
  };

  return (
    <section className="mt-4 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="bg-step-color laptop:w-[640px] flex w-full items-center justify-between rounded-xl p-4">
          <div className="flex items-center gap-2">
            {user?.profile_image ? (
              <Image
                src={user?.profile_image}
                alt="avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-[#3B4152] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              />
            ) : (
              <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <p className="font-ruso text-[18px]">{getInitials(user?.fullname)}</p>
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-black-light text-[18px] font-semibold">{user?.fullname}</p>
              <p className="font-semi-normal text-light-black text-[14px]">{user?.username}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <Image src={images.LEMON} alt="lemon" width={33} height={41} />
            <p className="absolute bottom-3.5 w-full text-center text-[12px] font-semibold text-black">
              L{splitLemonId(user?.lemon_id ?? "")}
            </p>
          </div>
        </div>
        <div className="laptop:w-[632px] w-full rounded-br-2xl rounded-bl-2xl bg-white p-4">
          <p className="font-semi-normal text-text-grey text-[12px]">Industry</p>
          <p className="text-black-light text-[14px] font-normal">
            {formatString(user?.industry ?? undefined)}
          </p>
          <p className="font-semi-normal text-text-grey mt-[8x] text-[12px]">Bio</p>
          <p className="text-black-light max-w-[600px] text-[14px] font-normal">{user?.bio}</p>
          {user?.socials && user.socials.length > 0 && (
            <>
              <p className="font-semi-normal text-text-grey mt-[8x] text-[12px]">Socials</p>
              <div className="bg-mid-grey flex w-fit gap-2 rounded-2xl p-1">
                {user.socials.map((link: { name?: string; value?: string }) => (
                  <a href={link.value} target="_blank" rel="noopener noreferrer" key={link.name}>
                    {link.name === "facebook" && <FacebookIcon />}
                    {link.name === "instagram" && <InstagramIcon />}
                    {link.name === "linkedin" && <LinkedInIcon />}
                    {link.name === "twitter" && <TwitterIcon />}
                    {link.name === "website" && <WebIcon />}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="laptop:w-[640px] mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-[12px] font-bold">ACCOUNT</p>
          <div>
            {accountSettings.map((item) => (
              <div
                key={item.title}
                className="my-[20.5px] flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className="text-[16px] font-normal">{item.title}</p>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>

        <div className="laptop:w-[640px] mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-[12px] font-bold">EARN</p>
          <div>
            {earnSettings.map((item) => (
              <div
                key={item.title}
                className="my-[20.5px] flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className="text-[16px] font-normal">{item.title}</p>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>

        <div className="laptop:w-[640px] mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-[12px] font-bold">MORE</p>
          <div>
            {moreSettings.map((item) => (
              <div
                key={item.title}
                className="my-[20.5px] flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className={`text-[16px] font-normal ${item.textColor ?? ""}`}>{item.title}</p>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsClient;
