"use client";
import { useNavigation } from "@/hooks/useNavigation";
import { BadgeCheck, Loader2 } from "lucide-react";
import { FallbackImage } from "@/components/global/FallbackImage";
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
import { useSupportUnreadQuery } from "@/features/settings/queries";
import { useSubscriptionQuery } from "@/features/authentication/queries";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { formatString, getInitials, splitLemonId } from "@/lib/helper";
import { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";

type SettingsItem = {
  title: string;
  icon: React.ComponentType;
  path?: string;
};

const accountSettings: SettingsItem[] = [
  {
    title: "Profile settings",
    icon: ProfileIcon,
    path: routes.SETTINGS_PROFILE,
  },
  { title: "Account settings", icon: GearIcon, path: routes.SETTINGS_ACCOUNT },
  { title: "Pricing", icon: PricingIcon, path: routes.SETTINGS_PLAN },
  {
    title: "Billing history",
    icon: BillingIcon,
    path: routes.SETTINGS_BILLING_HISTORY,
  },
  {
    title: "Notification settings",
    icon: BellIcon,
    path: routes.SETTINGS_NOTIFICATION,
  },
];

const earnSettings: SettingsItem[] = [
  { title: "Wallet", icon: WalletIcon, path: routes.SETTINGS_WALLET },
  { title: "Referrals", icon: ReferralIcon, path: routes.SETTINGS_REFERRAL },
];

// Profile card and settings menu for the signed-in user.
function SettingsClient() {
  const { push } = useNavigation();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: supportUnread } = useSupportUnreadQuery({ enabled: isLoggedIn });
  const { data: subscription } = useSubscriptionQuery({ enabled: isLoggedIn });
  const isMember = subscription?.subscription.is_member === true;
  const dispatch = useAppDispatch();
  const logoutMutation = useLogoutMutation();

  const moreSettings: SettingsItem[] = [
    { title: "Support messages", icon: PaperIcon, path: routes.SETTINGS_SUPPORT },
    {
      title: "Terms and conditions",
      icon: PaperIcon,
      path: routes.SETTINGS_TERMS,
    },
    { title: "Privacy policy", icon: PaperIcon, path: routes.SETTINGS_PRIVACY },
    { title: "Cookie policy", icon: PaperIcon, path: routes.SETTINGS_COOKIES },
    { title: "Help center", icon: PaperIcon, path: routes.HELP },
  ];

  const openItem = (item: SettingsItem) => {
    if (item.path) push(item.path);
  };

  const handleLogout = () => {
    // useLogoutMutation clears local session state even if the request fails.
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({ show: true, message: apiMessage(`Logged out`), type: "success" }),
        );
      },
      onSettled: () => {
        push(routes.LOGIN);
      },
    });
  };

  return (
    <section className="mt-4 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="bg-step-color laptop:w-160 relative flex w-full items-center justify-between rounded-xl p-4">
          {isMember && (
            <span className="text-meta absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-yellow-300 px-2 py-0.5 leading-normal font-semibold text-black">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Membership
            </span>
          )}
          <div className="flex items-center gap-2">
            {user?.profile_image ? (
              <FallbackImage
                src={user?.profile_image}
                fallbackSrc={images.AVATAR_4}
                alt="avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-[#3B4152] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              />
            ) : (
              <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <p className="font-ruso text-body-xl">{getInitials(user?.fullname)}</p>
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-black-light text-body-xl font-semibold">{user?.fullname}</p>
              <p className="font-semi-normal text-light-black text-body-s">{user?.username}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <Image src={images.LEMON} alt="lemon" width={33} height={41} />
            <p className="text-meta absolute bottom-3.5 w-full text-center leading-normal font-semibold text-black">
              L{splitLemonId(user?.lemon_id ?? "")}
            </p>
          </div>
        </div>
        <div className="laptop:w-158 w-full rounded-br-2xl rounded-bl-2xl bg-white p-4">
          <p className="font-semi-normal text-text-grey text-meta leading-normal">Industry</p>
          <p className="text-black-light text-body-s font-normal">
            {formatString(user?.industry ?? undefined)}
          </p>
          <p className="font-semi-normal text-text-grey text-meta mt-[8x] leading-normal">Bio</p>
          <p className="text-black-light text-body-s max-w-150 font-normal">{user?.bio}</p>
          {user?.socials && user.socials.length > 0 && (
            <>
              <p className="font-semi-normal text-text-grey text-meta mt-[8x] leading-normal">
                Socials
              </p>
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

        <div className="laptop:w-160 mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-meta leading-normal font-bold">ACCOUNT</p>
          <div>
            {accountSettings.map((item) => (
              <div
                key={item.title}
                className="my-5.25 flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className="text-body-l font-normal">{item.title}</p>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>

        <div className="laptop:w-160 mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-meta leading-normal font-bold">EARN</p>
          <div>
            {earnSettings.map((item) => (
              <div
                key={item.title}
                className="my-5.25 flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className="text-body-l font-normal">{item.title}</p>
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>

        <div className="laptop:w-160 mt-6 w-full rounded-xl bg-white p-4">
          <p className="text-black-light text-meta leading-normal font-bold">MORE</p>
          <div>
            {moreSettings.map((item) => (
              <div
                key={item.title}
                className="my-5.25 flex cursor-pointer items-center justify-between"
                onClick={() => openItem(item)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p className="text-body-l font-normal">{item.title}</p>
                  {item.path === routes.SETTINGS_SUPPORT && (supportUnread?.unread ?? 0) > 0 && (
                    <span className="bg-red-1 text-meta rounded-full px-1.5 leading-normal font-medium text-white">
                      {supportUnread?.unread}
                    </span>
                  )}
                </div>
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>

        <div className="laptop:w-160 mt-6 w-full rounded-xl bg-white p-4">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between disabled:cursor-wait"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <span className="flex items-center gap-2">
              <LogoutIcon />
              <span className="text-body-l text-red-1 font-normal">Log out</span>
            </span>
            {logoutMutation.isPending && (
              <Loader2 className="animate-spin text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default SettingsClient;
