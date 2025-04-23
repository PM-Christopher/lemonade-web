"use client";
import React from 'react';
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
import { formatString, splitLemonId } from "@/lib/helper";
import MainLayout from "@/components/layouts/MainLayout";

interface SettingsItem {
    title: string;
    icon: React.ComponentType;
    path: string;
}

const accountSettings: SettingsItem[] = [
    { title: "Profile settings", icon: ProfileIcon, path: "/settings/profile" },
    { title: "Account settings", icon: GearIcon, path: "/settings/account" },
    { title: "Pricing", icon: PricingIcon, path: "/settings/pricing" },
    { title: "Billing History", icon: BillingIcon, path: "/settings/billing-history" },
    { title: "Notification settings", icon: BellIcon, path: "/settings/notification" },
];

const earnSettings: SettingsItem[] = [
    { title: "Wallet", icon: WalletIcon, path: "/settings/wallet" },
    { title: "Referrals", icon: ReferralIcon, path: "/settings/referral" },
];

const moreSettings: SettingsItem[] = [
    { title: "Support", icon: SupportIcon, path: "/settings/support" },
    { title: "Terms and conditions", icon: PaperIcon, path: "/settings/terms-and-conditions" },
    { title: "Privacy policy", icon: PaperIcon, path: "/settings/privacy" },
];

function SettingsPage() {
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center"
                >
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft />
                        <p className="font-sans font-semibold text-[16px] tracking-custom">User Details</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-full laptop:w-[640px] rounded-[12px] p-[16px] flex justify-between items-center bg-step-color"
                        >
                            <div className="flex items-center gap-[8px]">
                                <Image
                                    src={user?.profile_image}
                                    alt="profile"
                                    width={56}
                                    height={56}
                                    className="w-[56px] h-[56px] rounded-[24px] border-[1px] border-grey-90"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[18px] text-black-light">{user?.fullname}</p>
                                    <p className="font-semi-normal text-[14px] text-light-black">{user?.username}</p>
                                </div>
                            </div>
                            <div className="relative flex items-center justify-center">
                                <Image src={'/images/lemon.png'} alt="lemon" width={33} height={41} />
                                <p className="absolute bottom-3.5 text-black text-[12px] font-semibold text-center w-full">
                                    L{splitLemonId(user?.lemon_id)}
                                </p>
                            </div>
                        </div>
                        <div className="w-full laptop:w-[632px] p-[16px] rounded-br-[16px] rounded-bl-[16px] bg-white">
                            <p className="font-semi-normal text-[12px] text-text-grey">Industry</p>
                            <p className="font-normal text-[14px] text-black-light">{formatString(user?.industry)}</p>
                            <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Bio</p>
                            <p className="text-[14px] font-normal text-black-light max-w-[600px]">
                                {user?.bio}
                            </p>
                            {user?.socials.length > 0 && (
                                <>
                                    <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Socials</p>
                                    <div className="flex bg-mid-grey rounded-[16px] p-[4px] gap-[8px] w-fit">
                                        {user?.socials.map((link: any) => (
                                            <a
                                                href={link.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={link.name}
                                            >
                                                {link.name === 'facebook' && <FacebookIcon />}
                                                {link.name === 'instagram' && <InstagramIcon />}
                                                {link.name === 'linkedin' && <LinkedInIcon />}
                                                {link.name === 'twitter' && <TwitterIcon />}
                                                {link.name === 'website' && <WebIcon />}
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-[24px] w-full laptop:w-[640px] p-[16px] bg-white rounded-[12px]">
                            <p className="font-bold text-[12px] text-black-light">ACCOUNT</p>
                            <div>
                                {accountSettings.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex justify-between items-center my-[20.5px] cursor-pointer"
                                        onClick={() => router.push(item.path)}
                                    >
                                        <div className="flex gap-[8px] items-center">
                                            <item.icon />
                                            <p className="font-normal text-[16px]">{item.title}</p>
                                        </div>
                                        <ChevronRight />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-[24px] w-full laptop:w-[640px] p-[16px] bg-white rounded-[12px]">
                            <p className="font-bold text-[12px] text-black-light">EARN</p>
                            <div>
                                {earnSettings.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex justify-between items-center my-[20.5px] cursor-pointer"
                                        onClick={() => router.push(item.path)}
                                    >
                                        <div className="flex gap-[8px] items-center">
                                            <item.icon />
                                            <p className="font-normal text-[16px]">{item.title}</p>
                                        </div>
                                        <ChevronRight />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-[24px] w-full laptop:w-[640px] p-[16px] bg-white rounded-[12px]">
                            <p className="font-bold text-[12px] text-black-light">MORE</p>
                            <div>
                                {moreSettings.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex justify-between items-center my-[20.5px] cursor-pointer"
                                        onClick={() => router.push(item.path)}
                                    >
                                        <div className="flex gap-[8px] items-center">
                                            <item.icon />
                                            <p className="font-normal text-[16px]">{item.title}</p>
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