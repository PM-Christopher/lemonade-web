"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CopyIcon from "@/images/icons/copyGreenIcon.svg"
import ShareIcon from "@/images/icons/shareGreenIcon.svg"
import ReferralIcon from "@/images/icons/referralGreenIcon.svg"
import LongLine from "@/images/icons/longLine.svg"
import ChevronRight from "@/images/icons/chevronRight.svg"
import ReferralHistory from "@/components/settings/Modal/ReferralHistory";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";

function ReferralSettingsPage({}) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {user} = useSelector((state: any) => state.auth)
    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const [copied, setCopied] = useState(false);
    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Copied to clipboard",
                    type: "success",
                })
            );
            setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
        });
    };

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.push("/settings")}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Referrals</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-0 laptop:gap-[16px]">
                        <div className="bg-light-green-10 rounded-[12px]">
                            <div className="w-full laptop:w-[560px] p-[24px] flex justify-center items-center">
                                <Image src={"/images/giftImage.png"} alt="gift_image" width={160} height={171}/>
                            </div>
                            <div className="w-screen laptop:w-[560px] p-[24px] flex flex-col gap-[8px]">
                                <div className="flex justify-between items-center gap-[2px]">
                                    <div
                                        className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] p-[10.5px] bg-light-tint-4 w-full">
                                        <p className="font-bold text-[18px] text-mid-green">
                                            {user?.username?.toUpperCase()}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px] cursor-pointer"
                                        onClick={() => handleCopy(user?.username?.toUpperCase())}
                                    >
                                        <CopyIcon/>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-[2px]">
                                    <div
                                        className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] h-[48px] bg-light-tint-4 w-full items-center flex">
                                        <p className="font-semi-normal text-[14px] text-mid-green">
                                            {window.location.origin}/ref=?{user.username}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px]">
                                        <ShareIcon/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-screen laptop:w-[560px] p-[24px] flex flex-col gap-[8px] mt-0 laptop:mt-[24px] bg-white rounded-[12px]">
                            <p className="font-semibold text-[16px]">Refer friends and earn</p>
                            <div className="flex flex-col mt-[24px]">
                                <div className="flex gap-[16px]">
                                    <div className="bg-light-green-10 p-[12px] rounded-[12px]">
                                        <ReferralIcon className="w-[24px] h-[24px]"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-[16px]">2% of the subscription fee</p>
                                        <p className="font-normal text-[14px] text-text-grey">When they subscribe to
                                            Membership</p>
                                    </div>
                                </div>
                                <div className="relative left-[21px]">
                                    <LongLine className="w-[4px] h-[48px]"/>
                                </div>
                                <div className="flex gap-[16px]">
                                    <div className="bg-light-green-10 p-[12px] rounded-[12px]">
                                        <ReferralIcon className="w-[24px] h-[24px]"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-[16px]">2% of the renewal fee</p>
                                        <p className="font-normal text-[14px] text-text-grey">When they renew their
                                            Subscription</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-[24px] cursor-pointer"
                                 onClick={toggleModal}>
                                <p className="font-semi-normal text-[16px]">Referral activity</p>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>
                </section>
                <ReferralHistory toggle={toggleModal} isOpen={isOpen}/>
            </section>
        </MainLayout>
    );
}

export default ReferralSettingsPage;