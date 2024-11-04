"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import SearchIcon from "@/images/icons/search.svg";
import UploadIcon from "@/images/icons/uploadIcon.svg";
import ScanIcon from "@/images/icons/scanIcon.svg";
import pageData from "../../../../../../pageData.json"
import GuestDetailsModal from "@/components/events/Modals/GuestDetailsModal";
import CheckedInModal from "@/components/events/Modals/CheckedInModal";
import MainLayout from "@/components/layouts/MainLayout";

function GuestListPage() {
    const [guestList, setGuestList] = useState(pageData['guestList'])
    const [isOpen, setIsOpen] = useState(false)
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleCheckInModal = () => {
        setIsCheckInOpen(!isCheckInOpen)
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Guest list</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center gap-4">
                    <div className="w-[800px] bg-white rounded-[12px] p-[24px]">
                        <div className="flex gap-3">
                            <div
                                className="flex items-center gap-3 bg-light_grey p-2 px-[12px] h-[48px] w-full rounded-[12px]">
                                <div>
                                    <SearchIcon/>
                                </div>
                                <div className="w-full">
                                    <input
                                        id="search"
                                        type="text"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                        placeholder="Search guest name, email address"
                                    />
                                </div>
                            </div>
                            <div className="p-[12px] rounded-[12px] bg-light_grey flex items-center">
                                <UploadIcon className="w-[18px]"/>
                            </div>
                            <div className="p-[12px] rounded-[12px] bg-light_grey flex items-center">
                                <ScanIcon className="w-[18px]"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[800px] bg-white rounded-[12px] p-[24px]">
                        <div className="flex flex-col">
                            {
                                guestList.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">{item.name}</p>
                                                <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">{item.ticket_type}</p>
                                            </div>
                                            <ChevronRight className="cursor-pointer" onClick={toggleMenu}/>
                                        </div>
                                        <div className="border-t-[1px] border-t-mid-grey mt-[16px] mb-[16px]"></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <GuestDetailsModal toggleMenu={toggleMenu} isOpen={isOpen}/>
                <CheckedInModal toggle={toggleCheckInModal} isOpen={isCheckInOpen}/>
            </section>
        </MainLayout>
    );
}

export default GuestListPage;