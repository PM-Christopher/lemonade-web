"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@lemonade/ui";
import Image from "next/image";
import SearchIcon from "@/images/icons/search.svg";
import TribeCardList from "@/components/tribe/TribeCardList";
import { TribeInterface } from "@/interfaces/TribeInterface";
import MainLayout from "@/components/layouts/MainLayout";
import { useMediaQuery } from "react-responsive";
import { useTribesQuery } from "@/features/tribes/queries";
import { useSearchTribeMutation } from "@/features/tribes/mutations";
import { TribeListSkeleton } from "@/components/Skeletons";
import { usePersistentMenuState } from "@/context/MenuStateProvider";
import dynamic from "next/dynamic";

// Off the initial bundle — only needed once "Create tribe" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const CreateTribeModal = dynamic(
  () => import("@/components/tribe/CreateTribeModal"),
  {
    ssr: false,
  },
);

export default function TribeListClient() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { setActive, getActive } = usePersistentMenuState();

  // Always read tribe tab state from the "tribe" menu
  const persistedTribeType = getActive("tribe") ?? "discover";
  const [tribeType, setTribeType] = useState(persistedTribeType);

  // ✅ Sync local state when persisted value changes (e.g. after refresh hydration)
  useEffect(() => {
    setTribeType(persistedTribeType);
  }, [persistedTribeType]);

  const [search, setSearch] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const { data: tribesData, isLoading: loading } = useTribesQuery(tribeType);
  const tribes = tribesData?.tribes ?? [];

  const searchTribeMutation = useSearchTribeMutation();
  const searchResults = searchTribeMutation.data?.tribes ?? [];

  const handleTribeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasSearched(true);
    const value = e.target.value;
    setSearch(value);
    searchTribeMutation.mutate(value);
  };

  const [modalFlag, setModalFlag] = useState(false);

  const activateModal = () => {
    setModalFlag(!modalFlag);
  };

  const changeTribeType = (type: string) => {
    setTribeType(type);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-between gap-4 border-y border-gray-200 bg-white px-6 py-3 tablet:flex-row">
        <div className="sm:gap-6 flex gap-4">
          {[
            { key: "discover", label: "Discover" },
            { key: "tln", label: "TLN Tribes" },
            { key: "mine", label: "My Tribes" },
          ].map((tab) => {
            const isActive = tribeType === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  changeTribeType(tab.key);
                  setActive("tribe", tab.key);
                }}
                className="group flex flex-col items-center px-4 py-2"
              >
                <span
                  className={[
                    "font-sans text-sm leading-[21px] transition-colors duration-200",
                    isActive
                      ? "font-semibold text-black-light"
                      : "font-normal text-text-grey",
                  ].join(" ")}
                >
                  {tab.label}
                </span>

                {/* centered underline */}
                <span
                  className={[
                    "h-[2px] rounded-full bg-step-color transition-all duration-300 ease-out",
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>

        {/* Search & Create Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <div className="block tablet:hidden">
            <div className="flex h-[44px] w-[260px] items-center gap-3 rounded-xl bg-light_grey p-2">
              <SearchIcon className="text-gray-500" />
              <input
                type="text"
                placeholder="Search tribe"
                className="w-full border-0 bg-light_grey text-sm placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Create Button */}
          <Button
            className="auth-button flex items-center gap-2 rounded-xl border-step-color px-4 py-2 shadow-custom-bottom"
            onClick={activateModal}
          >
            <span className="text-base font-medium">
              {isMobile ? "+" : "+ Create Tribe"}
            </span>
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4 flex flex-col justify-center gap-6 px-4 tablet:flex-row tablet:px-10">
        {/* Tribe List Section */}
        <section className="min-h-[200px] w-full rounded-xl bg-white p-6 shadow-div-shadow-2 tablet:w-[700px]">
          {loading ? (
            <TribeListSkeleton count={4} />
          ) : tribes?.length > 0 ? (
            <div className="hide-scrollbar max-h-[80vh] space-y-4 overflow-y-auto">
              {tribes.map((tribe: TribeInterface, index: number) => (
                <Link href={`/tribe/${tribe.slug}`} key={index}>
                  <TribeCardList tribe={tribe} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg font-medium text-gray-500">
                No tribes found
              </p>
            </div>
          )}
        </section>

        {/* Search Sidebar (Desktop) */}
        <section className="hidden h-fit w-[420px] rounded-xl bg-white p-6 tablet:block">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative w-full">
              {/* Search Input */}
              <div className="flex items-center gap-3 rounded-xl bg-light_grey p-2">
                <SearchIcon className="text-gray-500" />
                <input
                  id="search"
                  type="text"
                  className="w-full border-0 bg-light_grey text-sm placeholder-gray-500 focus:outline-none"
                  placeholder="Search tribe"
                  value={search}
                  onChange={handleTribeSearch}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                />
              </div>

              {/* Tooltip */}
              {(!search || search.trim() === "") && showTooltip && (
                <div className="animate-fade-in absolute bottom-[-28px] left-2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-md">
                  Start typing to search...
                  <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-gray-800"></div>
                </div>
              )}
            </div>

            {/* Recent Search */}
            <p className="text-sm font-semibold text-gray-500">Recent Search</p>

            <div className="flex flex-col">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((tribe: TribeInterface, index: number) => (
                    <Link
                      href={`/tribe/${tribe.slug}`}
                      key={tribe.slug || index}
                      className="group flex items-center gap-3 px-3 py-3 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          src={tribe.image}
                          alt={tribe.tribe_name}
                          width={48}
                          height={48}
                          className="h-[48px] w-[48px] rounded-xl border border-gray-200 object-cover transition-colors group-hover:border-gray-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-950">
                          {tribe.tribe_name}
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : hasSearched && search !== "" ? (
                // After user has searched and nothing found
                <div className="flex flex-col items-center justify-center px-4 py-8">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    No tribes found
                  </p>
                  <p className="text-center text-xs text-gray-500">
                    Try a different name or keyword.
                  </p>
                </div>
              ) : (
                // Before user has ever searched
                <div className="flex flex-col items-center justify-center px-4 py-8">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    No recent searches
                  </p>
                  <p className="text-center text-xs text-gray-500">
                    Your search history will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <CreateTribeModal modalFlag={modalFlag} activateModal={activateModal} />
    </MainLayout>
  );
}
