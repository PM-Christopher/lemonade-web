"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import Avatar from "@/image/avatar_4.png"
import Image from "next/image";
import UploadCamIcon from "@/image/icons/UploadCameraIcon.svg"
import FacebookIcon from "@/image/icons/facebook-color.svg"
import InstagramIcon from "@/image/icons/instagram-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import WebIcon from "@/image/icons/WebIcon.svg"
import PencilIcon from "@/image/icons/PencilIcon.svg"
import UpdateModal from "@/components/Settings/Modal/UpdateModal";

const ProfileSettingsPage = ({}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Profile settings</p>
                </div>
            </div>

            <section className="min-h-screen mt-[61.5px] flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <Image src={Avatar} alt="avatar" width={84} className="rounded-[24px] border-[1px] border-grey-90"/>
                        <UploadCamIcon className="absolute bottom-0 right-[-14px] w-8 h-8"/>
                    </div>
                    <div className="w-[640px] rounded-[12px] mt-[45.5px] p-[16px] flex flex-col bg-white gap-[8px]">
                        <div className="flex justify-between">
                            <p className="font-normal text-[14px]  text-text-grey">Full name</p>
                            <p className="font-semi-normal text-[14px]  text-black-light">Christine Joe</p>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Email address</p>
                            <p className="font-semi-normal text-[14px]  text-black-light">ChrisJoe@gmail.com</p>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Lemonade tag</p>
                            <p className="font-semi-normal text-[14px]  text-black-light">Lemon 32 (L32)</p>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Username</p>
                            <div className="flex gap-2 items-center">
                                <p className="font-semi-normal text-[14px]  text-black-light">Chrisjoe</p>
                                <PencilIcon className="w-[16px] h-[16px] cursor-pointer" onClick={toggleModal}/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Bio</p>
                            <div className="flex gap-2 items-center">
                                <p className="font-semi-normal text-[14px] max-w-[163px] truncate text-black-light">I am
                                    a
                                    STEM professional doing really good things</p>
                                <PencilIcon className="w-[16px] h-[16px]"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                        <p className="font-normal text-[14px]  text-text-grey">Profession</p>
                            <div className="flex gap-2 items-center">
                                <p className="font-semi-normal text-[14px] text-black-light">Software
                                    engineer</p>
                                <PencilIcon className="w-[16px] h-[16px]"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Address</p>
                            <div className="flex gap-2 items-center">
                                <p className="font-semi-normal text-[14px] max-w-[130px] truncate text-black-light">23
                                    Adeniyi Jones, Ikeja, Lagos</p>
                                <PencilIcon className="w-[16px] h-[16px]"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                        <p className="font-normal text-[14px]  text-text-grey">Skills & interests</p>
                            <div className="flex gap-2 items-center">
                                <p className="font-semi-normal text-[14px] text-black-light">12</p>
                                <PencilIcon className="w-[16px] h-[16px]" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-[8px]">
                            <p className="font-normal text-[14px]  text-text-grey">Socials</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-[8px] bg-light_grey p-[4px] rounded-[18px]">
                                    <FacebookIcon className="w-[20px] h-[20px]" />
                                    <InstagramIcon className="w-[20px] h-[20px]" />
                                    <LinkedInIcon className="w-[20px] h-[20px]" />
                                    <TwitterIcon className="w-[20px] h-[20px]" />
                                    <WebIcon className="w-[20px] h-[20px]" />
                                </div>
                                <PencilIcon className="w-[16px] h-[16px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <UpdateModal toggle={toggleModal} isOpen={isOpen} />
        </section>
    );
}

export default ProfileSettingsPage