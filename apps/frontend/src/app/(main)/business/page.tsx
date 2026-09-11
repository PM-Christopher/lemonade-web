"use client"
import React, {useEffect, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import BusinessSection from "@/components/business/Sections/BusinessSection";
import ListingSection from "@/components/business/Sections/ListingSection";
import BusinessSubMenu from "@/components/business/Menu/BusinessSubMenu";
import SideMenu from "@/components/business/SideMenu";
import ServiceDetailsModal from "@/components/business/Modals/ServiceDetailsModal";
import {useSelector} from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import BusinessFilter from "@/components/business/Modals/BusinessFilter";
import {RootState} from "@/redux/store";
import {getBusinesses, getListings} from "@/features/business/business.slice";
import {useAppDispatch} from "@/redux/hook";
import {usePersistentMenuState} from "@/context/MenuStateProvider";

const BusinessPage = () => {
    const dispatch = useAppDispatch()
    const {setActive, getActive, selectedMenu} = usePersistentMenuState()
    const persistedMenuOption = getActive("business") ?? "business";

    const [menuOption, setMenuOption] = useState(persistedMenuOption);
    // ✅ Sync local state when persisted value changes
    useEffect(() => {
        setMenuOption(persistedMenuOption);
    }, [persistedMenuOption]);

    const [isOpen, setIsOpen] = useState(false)
    const [isServiceOpen, setItServiceOpen] = useState(false)
    const [businessFilter, setBusinessFilter] = useState(false)

    // load items from redux store
    const {job, businesses, featured, listings, loading, jobLoading} = useSelector((state: RootState) => state.business)

    useEffect(() => {
        if (menuOption === "business") {
            dispatch(getBusinesses())
        } else if (menuOption === "listings") {
            dispatch(getListings())
        }
    }, [menuOption]);


    const switchOption = (option: string) => {
        setMenuOption(option)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleBusinessFilter = () => {
        setBusinessFilter(!businessFilter)
    }

    const toggleServiceDetailsMenu = () => {
        setItServiceOpen(!isServiceOpen)
    }

    const renderView = () => {
        switch (menuOption) {
            case "business":
                return <BusinessSection businesses={businesses} loading={loading} featured={featured}/>
            case "listings":
                return <ListingSection businesses={listings} loading={loading}/>
            default:
                return <BusinessSection businesses={businesses} featured={featured} loading={loading}/>
        }
    }

    const renderSubMenu = () => {
        switch (menuOption) {
            case "business":
                return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter}/>
            case "listings":
                return <></>
            default:
                return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter}/>
        }
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} detailsToggle={toggleServiceDetailsMenu}/>
                <div
                    className="bg-white flex flex-col laptop:flex-row justify-between p-5 px-10 border-t-[1px] border-b-[1px] laptop:items-center gap-2">
                    <div className="relative inline-flex rounded-xl bg-mid-grey p-[0.35em] text-sm sm:text-base">
                        {/* Sliding pill */}
                        <span
                            className={[
                                "absolute inset-[0.35em] w-[calc(50%-0.35em)] rounded-[0.7em] bg-white",
                                "transition-transform duration-300 ease-out",
                                menuOption === "listings" ? "translate-x-full" : "translate-x-0",
                            ].join(" ")}
                        />

                        {[
                            {key: "business", label: "Business"},
                            {key: "listings", label: "Listings"},
                        ].map((tab) => {
                            const isActive = menuOption === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        switchOption(tab.key)
                                        setActive("business", tab.key)
                                    }}
                                    className="relative z-10 w-1/2 rounded-[0.7em] px-[1em] py-[0.55em] flex items-center justify-center"
                                >
                                    <span
                                        className={[
                                            "font-sans leading-none transition-colors duration-200",
                                            isActive ? "font-semibold text-gray-900" : "font-normal text-text-grey",
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
                {job && (
                    <ServiceDetailsModal
                        job={job}
                        isOpen={isServiceOpen}
                        toggleMenu={toggleServiceDetailsMenu}
                        loading={jobLoading}
                    />
                )}
                <BusinessFilter toggle={toggleBusinessFilter} isOpen={businessFilter}/>
            </section>
        </MainLayout>
    );
}

export default BusinessPage;