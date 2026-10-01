"use client";
import React, { useState } from "react";
import BusinessSection from "@/components/business/Sections/BusinessSection";
import ListingSection from "@/components/business/Sections/ListingSection";
import BusinessSubMenu from "@/components/business/Menu/BusinessSubMenu";
import SideMenu from "@/components/business/SideMenu";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import BusinessFilter from "@/components/business/Modals/BusinessFilter";
import { RootState } from "@/redux/store";
import { useBusinessesQuery, useListingsQuery } from "@/features/business/queries";
import { usePersistentMenuState } from "@/context/MenuStateProvider";
import dynamic from "next/dynamic";
import type { ServiceJob } from "@/components/business/Modals/ServiceDetailsModal";

// Off the initial bundle — only needed once a service card is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const ServiceDetailsModal = dynamic(
  () => import("@/components/business/Modals/ServiceDetailsModal"),
  { ssr: false },
);

const BusinessListClient = () => {
  const { setActive, getActive } = usePersistentMenuState();
  const persistedMenuOption = getActive("business") ?? "business";

  const [menuOption, setMenuOption] = useState(persistedMenuOption);
  const [seenMenu, setSeenMenu] = useState(persistedMenuOption);
  if (persistedMenuOption !== seenMenu) {
    setSeenMenu(persistedMenuOption);
    setMenuOption(persistedMenuOption);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isServiceOpen, setItServiceOpen] = useState(false);
  const [businessFilter, setBusinessFilter] = useState(false);

  const { selectedJob: job } = useSelector((state: RootState) => state.temp);
  const { data: businessesData, isLoading: businessesLoading } = useBusinessesQuery({
    enabled: menuOption === "business",
  });
  const { data: listingsData, isLoading: listingsLoading } = useListingsQuery({
    enabled: menuOption === "listings",
  });
  const businesses = businessesData?.businesses ?? [];
  const featured = businessesData?.featured ?? [];
  const listings = listingsData?.listings ?? [];
  const loading = menuOption === "business" ? businessesLoading : listingsLoading;
  const jobLoading = false;

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleBusinessFilter = () => {
    setBusinessFilter(!businessFilter);
  };

  const toggleServiceDetailsMenu = () => {
    setItServiceOpen(!isServiceOpen);
  };

  const renderView = () => {
    switch (menuOption) {
      case "business":
        return <BusinessSection businesses={businesses} loading={loading} featured={featured} />;
      case "listings":
        return <ListingSection businesses={listings} loading={loading} />;
      default:
        return <BusinessSection businesses={businesses} featured={featured} loading={loading} />;
    }
  };

  const renderSubMenu = () => {
    switch (menuOption) {
      case "business":
        return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter} />;
      case "listings":
        return <></>;
      default:
        return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter} />;
    }
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <SideMenu
          toggleMenu={toggleMenu}
          isOpen={isOpen}
          detailsToggle={toggleServiceDetailsMenu}
        />
        <div className="laptop:flex-row laptop:items-center flex flex-col justify-between gap-2 border-t border-b bg-white p-5 px-10">
          <div className="bg-mid-grey relative inline-flex rounded-xl p-[0.35em] text-sm sm:text-base">
            {/* Sliding pill */}
            <span
              className={[
                "absolute inset-[0.35em] w-[calc(50%-0.35em)] rounded-[0.7em] bg-white",
                "transition-transform duration-300 ease-out",
                menuOption === "listings" ? "translate-x-full" : "translate-x-0",
              ].join(" ")}
            />

            {[
              { key: "business", label: "Business" },
              { key: "listings", label: "Listings" },
            ].map((tab) => {
              const isActive = menuOption === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    switchOption(tab.key);
                    setActive("business", tab.key);
                  }}
                  className="relative z-10 flex w-1/2 items-center justify-center rounded-[0.7em] px-[1em] py-[0.55em]"
                >
                  <span
                    className={[
                      "font-sans leading-none transition-colors duration-200",
                      isActive ? "font-semibold text-gray-900" : "text-text-grey font-normal",
                    ].join(" ")}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {renderSubMenu()}
        </div>
        {renderView()}
        {Boolean(job) && (
          <ServiceDetailsModal
            job={job as ServiceJob}
            isOpen={isServiceOpen}
            toggleMenu={toggleServiceDetailsMenu}
            loading={jobLoading}
          />
        )}
        <BusinessFilter toggle={toggleBusinessFilter} isOpen={businessFilter} />
      </section>
    </MainLayout>
  );
};

export default BusinessListClient;
