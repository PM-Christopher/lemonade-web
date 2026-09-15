"use client";
import React, { useEffect, useState, use } from "react";
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
import GuestSideMenu from "@/components/events/GuestSideMenu";

const CheckInsPage = (props: { params: Promise<{ id: number }> }) => {
  const params = use(props.params);
  const { data: guestListData, isLoading: loading } = useGuestListQuery(params.id);
  const guestList = guestListData?.guest_list ?? [];
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const { data: guestDetailsData, isLoading: guestDetailLoading } = useGuestDetailsQuery(
    params.id,
    selectedGuest?.id,
  );
  const guestDetails = guestDetailsData?.guest_details;

  useEffect(() => {
    if (!selectedGuest) return;
    toggleMenu();
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

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <GuestSideMenu
          toggleMenu={toggleMenu}
          isOpen={isOpen}
          guestDetails={guestDetails}
          loading={guestDetailLoading}
          id={params.id}
        />
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div
            className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Guest list</p>
          </div>
        </div>

        <div className={"mt-4 flex flex-col items-center gap-[8px]"}>
          <div
            className={"flex w-[800px] justify-between gap-[8px] rounded-[12px] bg-white p-[24px]"}
          >
            <div className="flex h-[48px] w-full items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
              <SearchIcon className="shrink-0" />
              <input
                id="search"
                type="text"
                className="flex-1 border-0 bg-light_grey text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                placeholder="Search guest name, email address"
              />
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-[12px] bg-light_grey p-3 transition-all duration-200 hover:bg-gray-200">
              <UploadIcon className="h-5 w-5 text-gray-700" />
            </div>

            <div className="flex cursor-pointer items-center justify-center rounded-[12px] bg-light_grey p-3 transition-all duration-200 hover:bg-gray-200">
              <ScanIcon className="h-5 w-5 text-gray-700" />
            </div>
          </div>

          <div
            className={
              "flex h-[900px] w-[800px] flex-col gap-[16px] rounded-[12px] bg-white p-[24px]"
            }
          >
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

export default CheckInsPage;
