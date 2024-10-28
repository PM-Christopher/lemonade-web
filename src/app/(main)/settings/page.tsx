"use client"
import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import Image from "next/image";
import Lemon from "@/image/Lemon.png";
import Avatar from "@/image/avatar_3.png";
import FacebookIcon from "@/image/icons/facebook-color.svg"
import InstagramIcon from "@/image/icons/instagram-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import WebIcon from "@/image/icons/WebIcon.svg"
import ChevronRight from "@/image/icons/ChevronRight.svg"

import ProfileIcon from "@/image/icons/ProfileIcon.svg"
import GearIcon from "@/image/icons/SettingsGearIcon.svg"
import PricingIcon from "@/image/icons/PricingIcon.svg"
import BillingIcon from "@/image/icons/BillingIcon.svg"
import BellIcon from "@/image/icons/BellIcon.svg"
import WalletIcon from "@/image/icons/WalletIcon.svg"
import ReferralIcon from "@/image/icons/ReferralIcon.svg"
import SupportIcon from "@/image/icons/SupportIcon.svg"
import PaperIcon from "@/image/icons/PaperIcon.svg"
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {formatString, splitLemonId} from "@/lib/helper";

function SettingsPage() {
    const router = useRouter()
    const {user} = useSelector((state: any) => state.auth)
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">User Details</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <div className="w-[640px] rounded-[12px] p-[16px] flex justify-between items-center bg-step-color">
                        <div className="flex items-center gap-[8px]">
                            <Image src={Avatar} alt="check in" width={56} height={56} className="w-[56px] h-[56px]"/>
                            <div className="flex flex-col">
                                <p className="font-semibold text-[18px] text-black-light">{user?.fullname}</p>
                                <p className="font-semi-normal text-[14px] text-light-black">{user?.username}</p>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <Image src={Lemon} alt="lemon"/>
                            <p className="absolute bottom-3.5 text-black text-[12px] font-semibold text-center w-full">
                                L{splitLemonId(user?.lemon_id)}
                            </p>
                        </div>
                    </div>
                    <div className="w-[632px] p-[16px] rounded-br-[16px] rounded-bl-[16px] bg-white">
                        <p className="font-semi-normal text-[12px] text-text-grey">Industry</p>
                        <p className="font-normal text-[14px] text-black-light">{formatString(user?.industry)}</p>
                        <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Bio</p>
                        <p className="text-[14px] font-normal text-black-light max-w-[600px]">
                            {user?.bio}
                        </p>
                        {
                            user?.socials.length > 0 && (
                                <>
                                    <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Socials</p>
                                    <div className="flex bg-mid-grey rounded-[16px] p-[4px] gap-[8px] w-fit">
                                        {
                                            user?.socials.map((link: any) => (
                                                <a href={link.value} target="_blank" rel="noopener noreferrer" key={link.name}>
                                                    {link.name === 'facebook' && <FacebookIcon/>}
                                                    {link.name === 'instagram' && <InstagramIcon/>}
                                                    {link.name === 'linkedin' && <LinkedInIcon/>}
                                                    {link.name === 'twitter' && <TwitterIcon/>}
                                                    {link.name === 'website' && <WebIcon/>}
                                                </a>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>

                    <div className="mt-[24px] w-[640px] p-[16px] bg-white rounded-[12px]">
                        <p className="font-bold text-[12px] text-black-light">ACCOUNT</p>
                        <div className="">
                            <div className="flex justify-between items-center my-[20.5px]">
                            <div className="flex gap-[8px] items-center">
                                    <ProfileIcon/>
                                    <p className="font-normal text-[16px]">Profile settings</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/profile")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <GearIcon/>
                                    <p className="font-normal text-[16px]">Account settings</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/account")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <PricingIcon/>
                                    <p className="font-normal text-[16px]">Pricing</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/pricing")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <BillingIcon/>
                                    <p className="font-normal text-[16px]">Billing History</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/billing-history")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <BellIcon/>
                                    <p className="font-normal text-[16px]">Notification settings</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/notification")} className="cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[24px] w-[640px] p-[16px] bg-white rounded-[12px]">
                        <p className="font-bold text-[12px] text-black-light">EARN</p>
                        <div className="">
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <WalletIcon/>
                                    <p className="font-normal text-[16px]">Wallet</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/wallet")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <ReferralIcon/>
                                    <p className="font-normal text-[16px]">Referrals</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/referral")} className="cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[24px] w-[640px] p-[16px] bg-white rounded-[12px]">
                        <p className="font-bold text-[12px] text-black-light">MORE</p>
                        <div className="">
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <SupportIcon/>
                                    <p className="font-normal text-[16px]">Support</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/support")} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <PaperIcon/>
                                    <p className="font-normal text-[16px]">Terms and conditions</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/terms-and-conditions")} className="cursor-pointer"/>
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <PaperIcon/>
                                    <p className="font-normal text-[16px]">Privacy policy</p>
                                </div>
                                <ChevronRight onClick={() => router.push("/settings/privacy")} className="cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default SettingsPage;