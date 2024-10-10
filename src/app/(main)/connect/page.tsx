"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import RequestIcon from "@/image/icons/RequestIcon.svg";
import SettingsIcon from "@/image/icons/gear.svg"
import SearchIcon from "@/image/icons/search.svg";
import ImageIcon from "@/image/icons/ImageIcon.svg"
import ChatListCard from "@/components/Jobs/ChatListCard";
import {Input} from "@/components/ui/input";
import avatar from "@/image/avatar_3.png";
import Image from "next/image";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg"
import UserInfoModal from "@/components/Connect/Modal/UserInfoModal";
import SettingsModal from "@/components/Connect/Modal/SettingsModal";

const ConnectPage = () => {
    const [isOpen,setIsOpen] = useState(false)
    const [isSettingsOpen,setIsSettingsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const toggleSettingsModal = () => {
        setIsSettingsOpen(!isSettingsOpen)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div>
                    <p className="font-semibold text-[14px]">Connect</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div
                        className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                    >
                        <RequestIcon/>
                        <p className="font-sans font-semi-normal text-[16px] text-black-light">Requests</p>
                    </div>
                    <div
                        className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                        onClick={toggleSettingsModal}
                    >
                        <SettingsIcon/>
                        <p className="font-sans font-semi-normal text-[16px] text-black-light">Settings</p>
                    </div>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex">
                    <div
                        className="w-[375px] h-[648px] border-[1px] bg-white flex flex-col rounded-tl-[16px] rounded-bl-[16px]">
                        <div className="p-[16px]">
                            <p className="font-bold text-[18px] text-black-light">Chats</p>
                        </div>
                        <div className="p-[8px] px-[16px]">
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px]">
                                <div>
                                    <SearchIcon/>
                                </div>
                                <div>
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                        placeholder="Search user, chat..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-screen hide-scrollbar">
                            <ChatListCard active={true}/>
                            <ChatListCard active={false}/>
                            <ChatListCard active={false}/>
                            <ChatListCard active={false}/>
                        </div>
                    </div>
                    <div
                        className="w-[560px] h-[648px] border-t-[1px] border-b-[1px] border-r-[1px] bg-white flex flex-col rounded-tr-[16px] rounded-br-[16px] relative">

                        <div
                            className="absolute top-0 left-0 w-full bg-grey-20 text-white p-[8px] rounded-tr-[16px]">
                            <div className="px-[16px] flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <Image src={avatar} alt="avatar" width={24}/>
                                    <p className="font-semibold text-[14px] text-black-light">Dan-maxy</p>
                                    <DotIcon className="w-[4px]"/>
                                    <p className="text-text-grey text-[14px] font-semibold">L1</p>
                                </div>
                                <MoreIcon className="cursor-pointer" onClick={toggleModal} />
                            </div>
                        </div>

                        <div
                            className="flex-grow flex flex-col-reverse overflow-y-auto justify-start items-center bg-white rounded-tr-[16px] rounded-br-[16px] p-[16px] mb-16">
                            <div
                                className="flex flex-col w-full gap-[12px] overflow-y-auto max-h-screen hide-scrollbar"> {/* Set a max height for scrolling */}
                                <div className="bg-light-green-10 text-right p-[8px] max-w-[303px] ml-auto rounded-[12px]">
                                    <p className="font-normal text-[14px]">This is my message for the day</p>
                                    <p className="text-[12px] text-right text-text-grey">1m ago</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute bottom-0 left-0 w-full bg-light_grey text-white p-[16px] px-[13px] rounded-br-[16px]">
                            <div className="flex gap-[8px] items-center">
                                <Input
                                    className="w-full rounded-full border-[1px] border-grey-80 shadow-none h-[40px] focus:outline-none focus:ring-0"
                                    placeholder="Reply..."/>
                                <ImageIcon className="w-[19.5px] cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <UserInfoModal toggle={toggleModal} isOpen={isOpen} />
            <SettingsModal toggle={toggleSettingsModal} isOpen={isSettingsOpen} />
        </section>
    );
}

export default ConnectPage;