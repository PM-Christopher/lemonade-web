"use client"
import React, {useEffect, useState} from 'react';
import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import SearchIcon from "@/images/icons/search.svg";
import UploadIcon from "@/images/icons/uploadIcon.svg"
import ScanIcon from "@/images/icons/scanIcon.svg"
import GuestListCard from "@/components/events/GuestListCard";
import {getGuestList, getGuestListDetails} from "@/features/events/event.slice";
import {RootState} from "@/redux/store";
import {GuestListSkeleton} from "@/components/Skeletons";
import {GuestListCardProps} from "@/interfaces/EventInterface";
import GuestSideMenu from "@/components/events/GuestSideMenu";

const CheckInsPage = ({params}: { params: { id: number } }) => {
    const dispatch = useAppDispatch()
    const {loading, guestList, guestDetails, guestDetailLoading} = useSelector((state: RootState) => state.event)
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);


    useEffect(() => {
        dispatch(getGuestList({id: params.id}))
    }, []);

    useEffect(() => {
        if (!selectedGuest) return
        dispatch(getGuestListDetails({id: params.id, guest_id: selectedGuest?.id}))
        toggleMenu()
    }, [selectedGuest]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedGuest(null);
        }
    }, [isOpen]);

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <GuestSideMenu toggleMenu={toggleMenu} isOpen={isOpen} guestDetails={guestDetails} loading={guestDetailLoading} id={params.id} />
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Guest list
                        </p>
                    </div>
                </div>

                <div className={'flex flex-col gap-[8px] mt-4 items-center'}>
                    <div className={'w-[800px] bg-white p-[24px] rounded-[12px] flex justify-between gap-[8px]'}>
                        <div
                            className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                            <SearchIcon className="shrink-0"/>
                            <input
                                id="search"
                                type="text"
                                className="flex-1 text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Search guest name, email address"
                            />
                        </div>
                        <div
                            className="flex items-center justify-center p-3 rounded-[12px] bg-light_grey hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                            <UploadIcon className="w-5 h-5 text-gray-700"/>
                        </div>

                        <div
                            className="flex items-center justify-center p-3 rounded-[12px] bg-light_grey hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                            <ScanIcon className="w-5 h-5 text-gray-700"/>
                        </div>
                    </div>

                    <div className={'bg-white w-[800px] h-[900px] p-[24px] rounded-[12px] flex flex-col gap-[16px]'}>
                        {
                            loading ? (
                                <GuestListSkeleton count={4}/>
                            ) : (
                                guestList?.map((guest: GuestListCardProps, index: number) => (
                                    <GuestListCard
                                        guest={guest}
                                        key={index}
                                        data={{
                                            isOpen: isOpen,
                                            toggleMenu: toggleMenu,
                                            setSelectedGuest: setSelectedGuest
                                    }}
                                    />
                                ))
                            )
                        }
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default CheckInsPage;