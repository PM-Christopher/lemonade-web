"use client"
import React, {useEffect, useState} from 'react';
import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {useRouter} from "next/navigation";
import SearchIcon from "@/images/icons/search.svg";
import UploadIcon from "@/images/icons/uploadIcon.svg"
import ScanIcon from "@/images/icons/scanIcon.svg"
import GuestListCard from "@/components/events/GuestListCard";
import {useGuestListQuery, useGuestDetailsQuery, useGuestSearchQuery} from "@/features/events/queries";
import {GuestListSkeleton} from "@/components/Skeletons";
import {GuestListCardProps} from "@/interfaces/EventInterface";
import GuestSideMenu from "@/components/events/GuestSideMenu";
import { Users } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

const CheckInsPage = ({params}: { params: { id: number } }) => {
    const {data: guestListData, isLoading: loading} = useGuestListQuery(params.id);
    const guestList = guestListData?.guest_list ?? [];
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const {data: guestDetailsData, isLoading: guestDetailLoading} = useGuestDetailsQuery(params.id, selectedGuest?.id);
    const guestDetails = guestDetailsData?.guest_details;

    useEffect(() => {
        if (!selectedGuest) return
        toggleMenu()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGuest]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedGuest(null);
        }
    }, [isOpen]);

    const {debouncedValue: debouncedSearchTerm} = useDebounce(searchTerm, 350);
    const {data: guestSearchData, isLoading: guestSearchLoading} = useGuestSearchQuery(params.id, debouncedSearchTerm);
    const guestSearchResults = guestSearchData?.guest_list ?? [];

    const safeSearchTerm = (searchTerm ?? "");
    const isSearching = (safeSearchTerm ?? "").trim().length > 0;
    const listToRender = isSearching ? guestSearchResults : guestList;
    const hasItems = Array.isArray(listToRender) && listToRender.length > 0;
    const isLoading = isSearching ? guestSearchLoading : loading;

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <GuestSideMenu toggleMenu={toggleMenu} isOpen={isOpen} guestDetails={guestDetails} loading={guestDetailLoading} id={params.id} />
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Guest list
                        </p>
                    </div>
                </div>

                <div className={'flex flex-col gap-[8px] mt-4 items-center'}>
                    <div className="w-full max-w-[880px] mx-auto">
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                            {/* Search */}
                            <div className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-gray-900/10 transition">
                                <SearchIcon className="h-5 w-5 shrink-0 text-gray-500" />

                                <input
                                    id="search"
                                    type="text"
                                    value={safeSearchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none"
                                    placeholder="Search guest name, email address"
                                />
                            </div>

                            {/* Action */}
                            <button
                                type="button"
                                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-200 hover:bg-gray-100 active:scale-[0.98] transition"
                                aria-label="Upload guest list"
                            >
                                <UploadIcon className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>
                    </div>


                    <div className="bg-white w-full max-w-[880px] p-[24px] rounded-[12px] flex flex-col gap-[16px] h-auto">
                        {isLoading ? (
                            <GuestListSkeleton count={4} />
                        ) : hasItems ? (
                            listToRender.map((guest: GuestListCardProps, index: number) => (
                                <GuestListCard
                                    key={guest.id ?? index}
                                    guest={guest}
                                    data={{
                                        isOpen,
                                        toggleMenu,
                                        setSelectedGuest,
                                    }}
                                />
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-2xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-gray-500" />
                                </div>

                                <p className="mt-4 text-sm font-medium text-gray-900">
                                    {isSearching ? "No guests found" : "No guests yet"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500 max-w-[420px]">
                                    {isSearching
                                        ? "Try searching with a different name, username, or email."
                                        : "Guests will appear here once people register or you upload a guest list."}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </MainLayout>
    );
};

export default CheckInsPage;