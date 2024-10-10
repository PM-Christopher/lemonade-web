import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import Avatar from "@/image/avatar_3.png";
import LocationIcon from "@/image/icons/LocationPinGreenIcon.svg"
import FacebookIcon from "@/image/icons/facebook-color.svg"
import InstagramIcon from "@/image/icons/instagram-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import WebIcon from "@/image/icons/WebIcon.svg"

type UserInfoInterface = {
    toggle: () => void,
    isOpen: boolean
}

const UserInfoModal: React.FC<UserInfoInterface> = ({toggle, isOpen}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">User Info</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col items-center justify-center">
                        <Image src={Avatar} alt="check in" width={64}/>
                        <p className="font-semibold text-[18px] mt-[16px]">Daniel232</p>
                        <p className="font-semi-normal text-[14px] text-light-black">Lemon 23 (L23)</p>
                        <p className="font-normal text-[12px] text-text-grey">Software engineer</p>
                        <div className="mt-[16px] flex gap-2 items-center">
                            <LocationIcon/>
                            <p className="font-semi-normal text-mid-green text-[12px]">3kms away</p>
                            <p className="text-grey-80">|</p>
                            <div className="p-[4px] px-[8px] rounded-[8px] bg-light-green-10">
                                <p className="text-[12px] text-mid-green font-semi-normal">connected</p>
                            </div>
                        </div>
                        <p className="max-w-[416px] font-normal text-[14px] text-light-black text-center mt-[16px]">
                            I am a STEM professional with over 20 years as a practicing advance mathematics engineer.
                            Looking to connect with others
                        </p>
                        <div className="mt-[16px]">
                            <p className="text-[14px] font-semibold text-center">Social links</p>
                            <div className="flex gap-[16px] mt-[12px]">
                                <FacebookIcon className="w-[24px]" />
                                <InstagramIcon className="w-[24px]" />
                                <LinkedInIcon className="w-[24px]" />
                                <TwitterIcon className="w-[24px]" />
                                <WebIcon className="w-[24px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfoModal;