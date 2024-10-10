"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import BusinessSection from "@/components/Business/Sections/BusinessSection";
import ListingSection from "@/components/Business/Sections/ListingSection";
import BusinessSubMenu from "@/components/Business/Menu/BusinessSubMenu";
import SideMenu from "@/components/Business/SideMenu";
import ServiceDetailsModal from "@/components/Business/Modals/ServiceDetailsModal";

const BusinessPage = () => {
    const [menuOption, setMenuOption] = useState("business");
    const [isOpen, setIsOpen] = useState(true)
    const [isServiceOpen, setItServiceOpen] = useState(false)

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
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} detailsToggle={toggleServiceDetailsMenu} />
            <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className={"flex gap-6 bg-mid-grey p-[4px] items-center rounded-[12px]"}>
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
            <ServiceDetailsModal isOpen={isServiceOpen} toggleMenu={toggleServiceDetailsMenu} />
        </section>
    );
}

export default BusinessPage;