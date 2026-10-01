"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useRouter } from "next/navigation";
import SearchIcon from "@/images/icons/search.svg";
import UploadIcon from "@/images/icons/uploadIcon.svg";
import ScanIcon from "@/images/icons/scanIcon.svg";
import GuestListCard from "@/components/events/GuestListCard";
import { useGuestListQuery, useGuestDetailsQuery } from "@/features/events/queries";
import { GuestListSkeleton } from "@/components/Skeletons";
import { GuestListCardProps } from "@/interfaces/EventInterface";
import GuestSideMenu, { type GuestDetails } from "@/components/events/GuestSideMenu";

const CheckInsClient = ({ id }: { id: number }) => {
  const { data: guestListData, isLoading: loading } = useGuestListQuery(id);
  const guestList = guestListData?.guest_list ?? [];
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestListCardProps | null>(null);

  const { data: guestDetailsData, isLoading: guestDetailLoading } = useGuestDetailsQuery(
    id,
    selectedGuest?.id,
  );
  const guestDetails = guestDetailsData?.guest_details;

  const toggleMenu = () => {
    setIsOpen((open) => !open);
    if (isOpen) setSelectedGuest(null);
  };

  const [seenGuest, setSeenGuest] = useState<GuestListCardProps | null>(null);
  if (selectedGuest && selectedGuest !== seenGuest) {
    setSeenGuest(selectedGuest);
    setIsOpen(true);
  }

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <GuestSideMenu
          toggleMenu={toggleMenu}
          isOpen={isOpen}
          guestDetails={guestDetails as GuestDetails}
          loading={guestDetailLoading}
          id={id}
        />
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Guest list</p>
          </div>
        </div>

        <div className={"mt-4 flex flex-col items-center gap-2"}>
          <div className={"flex w-[800px] justify-between gap-2 rounded-xl bg-white p-6"}>
            <div className="bg-light_grey flex h-12 w-full items-center gap-3 rounded-xl p-2 px-3">
              <SearchIcon className="shrink-0" />
              <input
                id="search"
                type="text"
                className="bg-light_grey flex-1 border-0 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search guest name, email address"
              />
            </div>
            <div className="bg-light_grey flex cursor-pointer items-center justify-center rounded-xl p-3 transition-all duration-200 hover:bg-gray-200">
              <UploadIcon className="h-5 w-5 text-gray-700" />
            </div>

            <div className="bg-light_grey flex cursor-pointer items-center justify-center rounded-xl p-3 transition-all duration-200 hover:bg-gray-200">
              <ScanIcon className="h-5 w-5 text-gray-700" />
            </div>
          </div>

          <div className={"flex h-[900px] w-[800px] flex-col gap-4 rounded-xl bg-white p-6"}>
            {loading ? (
              <GuestListSkeleton count={4} />
            ) : (
              guestList?.map((guest: GuestListCardProps, index: number) => (
                <GuestListCard
                  guest={guest}
                  key={index}
                  data={{
                    isOpen: isOpen,
                    toggleMenu: toggleMenu,
                    setSelectedGuest: setSelectedGuest,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CheckInsClient;
