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

function SettingsPage() {
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
                            <Image src={Avatar} alt="check in" width={56}/>
                            <div className="flex flex-col">
                                <p className="font-semibold text-[18px] text-black-light">Christine Joseph</p>
                                <p className="font-semi-normal text-[14px] text-light-black">christjoe</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Image src={Lemon} alt="lemon"/>
                            <p className="absolute bottom-3.5 left-2 text-black text-[12px] font-semibold text-center">
                                L12
                            </p>
                        </div>
                    </div>
                    <div className="w-[632px] p-[16px] rounded-br-[16px] rounded-bl-[16px] bg-white">
                        <p className="font-semi-normal text-[12px] text-text-grey">Industry</p>
                        <p className="font-normal text-[14px] text-black-light">Software engineer</p>
                        <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Bio</p>
                        <p className="text-[14px] font-normal text-black-light max-w-[600px]">I am a STEM professional
                            with over 20 years as a practicing advance mathematics engineer. Looking to connect with
                            others</p>
                        <p className="text-[12px] font-semi-normal text-text-grey mt-[8x]">Socials</p>
                        <div className="flex bg-mid-grey rounded-[16px] p-[4px] gap-[8px] w-fit">
                            <FacebookIcon/>
                            <InstagramIcon/>
                            <LinkedInIcon/>
                            <TwitterIcon/>
                            <WebIcon/>
                        </div>
                    </div>

                    <div className="mt-[24px] w-[640px] p-[16px] bg-white rounded-[12px]">
                        <p className="font-bold text-[12px] text-black-light">ACCOUNT</p>
                        <div className="">
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <ProfileIcon/>
                                    <p className="font-normal text-[16px]">Profile settings</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <GearIcon/>
                                    <p className="font-normal text-[16px]">Account settings</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <PricingIcon/>
                                    <p className="font-normal text-[16px]">Pricing</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <BillingIcon/>
                                    <p className="font-normal text-[16px]">Billing History</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <BellIcon/>
                                    <p className="font-normal text-[16px]">Notification settings</p>
                                </div>
                                <ChevronRight/>
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
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <ReferralIcon/>
                                    <p className="font-normal text-[16px]">Referrals</p>
                                </div>
                                <ChevronRight/>
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
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center my-[20.5px]">
                                <div className="flex gap-[8px] items-center">
                                    <PaperIcon/>
                                    <p className="font-normal text-[16px]">Terms and conditions</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between items-center mt-[20.5px] mb-[10px]">
                                <div className="flex gap-[8px] items-center">
                                    <PaperIcon/>
                                    <p className="font-normal text-[16px]">Privacy policy</p>
                                </div>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default SettingsPage;