"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import SideMenu from "@/components/events/SideMenu";
import EventsSectionView from "@/components/events/views/Events";
import OrganizerSectionView from "@/components/events/views/Organizer";
import EventSubMenu from "@/components/events/Menu/EventSubMenu";
import OrganizerSubMenu from "@/components/events/Menu/OrganizerSubMenu";
import AgentSectionView from "@/components/events/views/Agent";
import MainLayout from "@/components/layouts/MainLayout";
import TicketIcon from "@/images/icons/ticket.svg";
import SettingsIcon from "@/images/icons/settingsIcon.svg"
import FilterEventModal from "@/components/events/Modals/FilterEventModal";

const EventPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [menuOption, setMenuOption] = useState("events");
    const [togglePaymentModel, setTogglePaymentModel] = useState(false)
    const [toggleFilterEvent, setToggleFilterEvent] = useState(false)


    const activatePaymentModal = () => {
        setTogglePaymentModel(!togglePaymentModel)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const switchOption = (option: string) => {
        setMenuOption(option)
    }

    const activateFilterEvent = () => {
        setToggleFilterEvent(!toggleFilterEvent);
    };

    const renderView = () => {
        switch (menuOption) {
            case "events":
                return <EventsSectionView />
            case "organizer":
                return <OrganizerSectionView activatePaymentModal={activatePaymentModal} togglePaymentModel={togglePaymentModel} />
            case "agent":
                return <AgentSectionView />
        }
    }

    const renderSubMenu = () => {
        switch (menuOption){
            case "events":
                return <EventSubMenu toggleMenu={toggleMenu}  />
            case "organizer":
                return <OrganizerSubMenu toggle={activatePaymentModal} />
        }
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <SideMenu toggleMenu={toggleMenu} isOpen={isOpen}/>
                <div className="bg-white flex justify-between py-5 border-t-[1px] border-b-[1px] laptop:items-center flex-col laptop:flex-row gap-2">
                    <div className="flex justify-between items-center px-[16px]">
                        <div className={"flex gap-6 bg-mid-grey p-[4px] items-center rounded-[12px]"}>
                            <div
                                className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "events" && "bg-white rounded-[10px]"}`}
                                onClick={() => switchOption("events")}>
                                <p className={`font-sans leading-[24px] ${menuOption === 'events' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Events</p>
                            </div>
                            <div
                                className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "organizer" && "bg-white rounded-[10px]"}`}
                                onClick={() => switchOption("organizer")}>
                                <p className={`font-sans leading-[24px] ${menuOption === 'organizer' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Organizer</p>
                            </div>
                            <div
                                className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "agent" && "bg-white rounded-[10px]"}`}
                                onClick={() => switchOption("agent")}>
                                <p className={`font-sans leading-[24px] ${menuOption === 'agent' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Agent</p>
                            </div>
                        </div>
                        {
                            menuOption === "events" ? (
                                <div
                                    className="cursor-pointer flex laptop:hidden"
                                    onClick={toggleMenu}>
                                    <TicketIcon className="w-[23px] h-[16px]"/>
                                </div>
                            ) : menuOption === "organizer" && (
                                <div
                                    className="cursor-pointer flex laptop:hidden"
                                    onClick={toggleMenu}>
                                    <SettingsIcon className="w-[23px] h-[21px]"/>
                                </div>
                            )
                        }
                    </div>
                    {renderSubMenu()}
                </div>

                {renderView()}

            </section>
            <FilterEventModal toggle={activateFilterEvent} isOpen={toggleFilterEvent} />
        </MainLayout>
    );
}

export default EventPage;