"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import BusinessSection from "@/components/business/Sections/BusinessSection";
import ListingSection from "@/components/business/Sections/ListingSection";
import BusinessSubMenu from "@/components/business/Menu/BusinessSubMenu";
import SideMenu from "@/components/business/SideMenu";
import ServiceDetailsModal from "@/components/business/Modals/ServiceDetailsModal";
import {useSelector} from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";

const BusinessPage = () => {
    const [menuOption, setMenuOption] = useState("business");
    const [isOpen, setIsOpen] = useState(false)
    const [isServiceOpen, setItServiceOpen] = useState(false)

    const {job} = useSelector((state: any) => state.business)

    const switchOption = (option: string) => {
        setMenuOption(option)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleServiceDetailsMenu = () => {
        setItServiceOpen(!isServiceOpen)
    }

    const renderView = () => {
        switch (menuOption) {
            case "business":
                return <BusinessSection />
            case "listings":
                return <ListingSection />
            default:
                return <BusinessSection />
        }
    }

    const renderSubMenu = () => {
        switch (menuOption) {
            case "business":
                return <BusinessSubMenu toggle={toggleMenu} />
            case "listings":
                return <></>
            default:
                return <BusinessSubMenu toggle={toggleMenu} />
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
                <ServiceDetailsModal job={job} isOpen={isServiceOpen} toggleMenu={toggleServiceDetailsMenu}/>
            </section>
        </MainLayout>
    );
}

export default BusinessPage;