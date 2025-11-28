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

const BusinessPage = () => {
    const dispatch = useAppDispatch()
    const [menuOption, setMenuOption] = useState("business");
    const [isOpen, setIsOpen] = useState(false)
    const [isServiceOpen, setItServiceOpen] = useState(false)
    const [businessFilter, setBusinessFilter] = useState(false)

    // load items from redux store
    const { job, businesses, featured, listings, loading, jobLoading } = useSelector((state: RootState) => state.business)

    useEffect(() => {
        if (menuOption === "business") {
            dispatch(getBusinesses())
        }
        else if (menuOption === "listings") {
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
                return <BusinessSection businesses={businesses} loading={loading} featured={featured} />
            case "listings":
                return <ListingSection businesses={listings} loading={loading} />
            default:
                return <BusinessSection businesses={businesses} featured={featured} loading={loading} />
        }
    }

    const renderSubMenu = () => {
        switch (menuOption) {
            case "business":
                return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter} />
            case "listings":
                return <></>
            default:
                return <BusinessSubMenu toggle={toggleMenu} toggleBusiness={toggleBusinessFilter} />
        }
    }



    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} detailsToggle={toggleServiceDetailsMenu}/>
                <div className="bg-white flex flex-col laptop:flex-row justify-between p-5 px-10 border-t-[1px] border-b-[1px] laptop:items-center gap-2">
                    <div className={"flex gap-6 bg-mid-grey p-[4px] items-center rounded-[12px] w-fit"}>
                        <div
                            className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "business" && "bg-white rounded-[10px]"}`}
                            onClick={() => switchOption("business")}>
                            <p className={`font-sans leading-[24px] ${menuOption === 'business' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Business</p>
                        </div>
                        <div
                            className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "listings" && "bg-white rounded-[10px]"}`}
                            onClick={() => switchOption("listings")}>
                            <p className={`font-sans leading-[24px] ${menuOption === 'listings' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Listings</p>
                        </div>
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
                <BusinessFilter toggle={toggleBusinessFilter} isOpen={businessFilter} />
            </section>
        </MainLayout>
    );
}

export default BusinessPage;