import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import FacebookIcon from "@/images/icons/facebook-color.svg"
import InstagramIcon from "@/images/icons/instagram-color.svg"
import LinkedInIcon from "@/images/icons/linkedin-color.svg"
import TwitterIcon from "@/images/icons/twitter-color.svg"
import WebIcon from "@/images/icons/webIcon.svg"
import ChatIcon from "@/images/icons/chatIcon.svg"
import {formatString} from "@/lib/helper";

type UserInfoInterface = {
    toggle: () => void,
    isOpen: boolean,
    user: any
}

const UserInfoModal: React.FC<UserInfoInterface> = ({toggle, isOpen, user}) => {
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
                        <Image src={user?.avatar} alt="check in" width={64} height={64}
                               className="w-[64px] h-[64px] rounded-[24px] border-[1px] border-grey-90"/>
                        <p className="font-semibold text-[18px] mt-[16px]">{user?.username}</p>
                        <p className="font-normal text-[12px] text-text-grey">{formatString(user?.industry)}</p>
                        <p className="max-w-[416px] font-normal text-[14px] text-light-black text-center mt-[16px]">
                            {user?.bio}
                        </p>
                        <div className="mt-[16px]">
                            <p className="text-[14px] font-semibold text-center">Social links</p>
                            <div className="flex gap-[16px] mt-[12px]">
                                {
                                    user?.socials.map((link: any) => (
                                        <a href={link.value} target="_blank" rel="noopener noreferrer" key={link.name}>
                                            {link.name === 'facebook' && <FacebookIcon className="w-[24px]"/>}
                                            {link.name === 'instagram' && <InstagramIcon className="w-[24px]"/>}
                                            {link.name === 'linkedin' && <LinkedInIcon className="w-[24px]"/>}
                                            {link.name === 'twitter' && <TwitterIcon className="w-[24px]"/>}
                                            {link.name === 'website' && <WebIcon className="w-[24px]"/>}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="mt-[16px]">
                            <div className="w-[343px] h-[48px] p-[14px] px-[48px] flex items-center cursor-pointer border-[1px] border-light-grey-50 justify-center gap-[8px] rounded-[12px]">
                                <ChatIcon />
                                <p className="font-semi-normal text-[16px] text-black-light">Open chat</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfoModal;