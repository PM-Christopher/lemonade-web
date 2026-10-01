"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useRouter } from "next/navigation";
import SearchIcon from "@/images/icons/search.svg";
import UploadIcon from "@/images/icons/uploadIcon.svg";
import ScanIcon from "@/images/icons/scanIcon.svg";
import GuestListCard from "@/components/events/GuestListCard";
import {
  useGuestListQuery,
  useGuestDetailsQuery,
  useGuestSearchQuery,
} from "@/features/events/queries";
import { GuestListSkeleton } from "@/components/Skeletons";
import { GuestListCardProps } from "@/interfaces/EventInterface";
import GuestSideMenu from "@/components/events/GuestSideMenu";
import { Users } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

const GuestListClient = ({ id }: { id: number }) => {
  const { data: guestListData, isLoading: loading } = useGuestListQuery(id);
  const guestList = guestListData?.guest_list ?? [];
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestListCardProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, 350);
  const { data: guestSearchData, isLoading: guestSearchLoading } = useGuestSearchQuery(
    id,
    debouncedSearchTerm,
  );
  const guestSearchResults = guestSearchData?.guest_list ?? [];

  const safeSearchTerm = searchTerm ?? "";
  const isSearching = (safeSearchTerm ?? "").trim().length > 0;
  const listToRender = isSearching ? guestSearchResults : guestList;
  const hasItems = Array.isArray(listToRender) && listToRender.length > 0;
  const isLoading = isSearching ? guestSearchLoading : loading;

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <GuestSideMenu
          toggleMenu={toggleMenu}
          isOpen={isOpen}
          guestDetails={guestDetails}
          loading={guestDetailLoading}
          id={id}
        />
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[12px] px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Guest list</p>
          </div>
        </div>

        <div className={"mt-4 flex flex-col items-center gap-[8px]"}>
          <div className="mx-auto w-full max-w-[880px]">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              {/* Search */}
              <div className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-transparent transition focus-within:ring-2 focus-within:ring-gray-900/10">
                <SearchIcon className="h-5 w-5 shrink-0 text-gray-500" />

                <input
                  id="search"
                  type="text"
                  value={safeSearchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
                  placeholder="Search guest name, email address"
                />
              </div>

              {/* Action */}
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-200 transition hover:bg-gray-100 active:scale-[0.98]"
                aria-label="Upload guest list"
              >
                <UploadIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="flex h-auto w-full max-w-[880px] flex-col gap-[16px] rounded-[12px] bg-white p-[24px]">
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
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-200">
                  <Users className="h-6 w-6 text-gray-500" />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-900">
                  {isSearching ? "No guests found" : "No guests yet"}
                </p>

                <p className="mt-1 max-w-[420px] text-sm text-gray-500">
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

export default GuestListClient;
