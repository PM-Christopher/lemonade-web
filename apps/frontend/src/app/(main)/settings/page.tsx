"use client";
import React from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
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
import SupportIcon from "@/images/icons/supportIcon.svg";
import PaperIcon from "@/images/icons/paperIcon.svg";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { formatString, getInitials, splitLemonId } from "@/lib/helper";
import MainLayout from "@/components/layouts/MainLayout";
import { RootState } from "@/redux/store";

interface SettingsItem {
  title: string;
  icon: React.ComponentType;
  path: string;
}

const accountSettings: SettingsItem[] = [
  { title: "Profile settings", icon: ProfileIcon, path: "/settings/profile" },
  { title: "Account settings", icon: GearIcon, path: "/settings/account" },
  { title: "Plan", icon: PricingIcon, path: "/settings/plan" },
  { title: "Billing History", icon: BillingIcon, path: "/settings/billing-history" },
  { title: "Notification settings", icon: BellIcon, path: "/settings/notification" },
];

const earnSettings: SettingsItem[] = [
  { title: "Wallet", icon: WalletIcon, path: "/settings/wallet" },
  { title: "Referrals", icon: ReferralIcon, path: "/settings/referral" },
];

const moreSettings: SettingsItem[] = [
  // { title: "Support", icon: SupportIcon, path: "/settings/support" },
  { title: "Terms and conditions", icon: PaperIcon, path: "/settings/terms-and-conditions" },
  { title: "Privacy policy", icon: PaperIcon, path: "/settings/privacy" },
];

function SettingsPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:px-[64px]">
          <div className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]">
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">User Details</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex w-full items-center justify-between rounded-[12px] bg-step-color p-[16px] laptop:w-[640px]">
              <div className="flex items-center gap-[8px]">
                {user?.profile_image ? (
                  <Image
                    src={user?.profile_image}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-[40px] w-[40px] rounded-full border-[2px] border-[#3B4152] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  />
                ) : (
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-[2px] border-[#3B4152] bg-gradient-green text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                    <p className="font-ruso text-[18px]">{getInitials(user?.fullname)}</p>
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-[18px] font-semibold text-black-light">{user?.fullname}</p>
                  <p className="text-[14px] font-semi-normal text-light-black">{user?.username}</p>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <Image src={"/images/lemon.png"} alt="lemon" width={33} height={41} />
                <p className="absolute bottom-3.5 w-full text-center text-[12px] font-semibold text-black">
                  L{splitLemonId(user?.lemon_id)}
                </p>
              </div>
            </div>
            <div className="w-full rounded-bl-[16px] rounded-br-[16px] bg-white p-[16px] laptop:w-[632px]">
              <p className="text-[12px] font-semi-normal text-text-grey">Industry</p>
              <p className="text-[14px] font-normal text-black-light">
                {formatString(user?.industry)}
              </p>
              <p className="mt-[8x] text-[12px] font-semi-normal text-text-grey">Bio</p>
              <p className="max-w-[600px] text-[14px] font-normal text-black-light">{user?.bio}</p>
              {user?.socials && user.socials.length > 0 && (
                <>
                  <p className="mt-[8x] text-[12px] font-semi-normal text-text-grey">Socials</p>
                  <div className="flex w-fit gap-[8px] rounded-[16px] bg-mid-grey p-[4px]">
                    {user.socials.map((link: any) => (
                      <a
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={link.name}
                      >
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

            <div className="mt-[24px] w-full rounded-[12px] bg-white p-[16px] laptop:w-[640px]">
              <p className="text-[12px] font-bold text-black-light">ACCOUNT</p>
              <div>
                {accountSettings.map((item) => (
                  <div
                    key={item.title}
                    className="my-[20.5px] flex cursor-pointer items-center justify-between"
                    onClick={() => router.push(item.path)}
                  >
                    <div className="flex items-center gap-[8px]">
                      <item.icon />
                      <p className="text-[16px] font-normal">{item.title}</p>
                    </div>
                    <ChevronRight />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-[24px] w-full rounded-[12px] bg-white p-[16px] laptop:w-[640px]">
              <p className="text-[12px] font-bold text-black-light">EARN</p>
              <div>
                {earnSettings.map((item) => (
                  <div
                    key={item.title}
                    className="my-[20.5px] flex cursor-pointer items-center justify-between"
                    onClick={() => router.push(item.path)}
                  >
                    <div className="flex items-center gap-[8px]">
                      <item.icon />
                      <p className="text-[16px] font-normal">{item.title}</p>
                    </div>
                    <ChevronRight />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-[24px] w-full rounded-[12px] bg-white p-[16px] laptop:w-[640px]">
              <p className="text-[12px] font-bold text-black-light">MORE</p>
              <div>
                {moreSettings.map((item) => (
                  <div
                    key={item.title}
                    className="my-[20.5px] flex cursor-pointer items-center justify-between"
                    onClick={() => router.push(item.path)}
                  >
                    <div className="flex items-center gap-[8px]">
                      <item.icon />
                      <p className="text-[16px] font-normal">{item.title}</p>
                    </div>
                    <ChevronRight />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
}

export default SettingsPage;
