"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import SideMenu from "@/components/Events/SideMenu";
import EventsSectionView from "@/components/Events/views/Events";
import OrganizerSectionView from "@/components/Events/views/Organizer";
import EventSubMenu from "@/components/Events/Menu/EventSubMenu";
import OrganizerSubMenu from "@/components/Events/Menu/OrganizerSubMenu";
import AgentSectionView from "@/components/Events/views/Agent";

const EventPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [menuOption, setMenuOption] = useState("events");
    const [togglePaymentModel, setTogglePaymentModel] = useState(false)


    const activatePaymentModal = () => {
        setTogglePaymentModel(!togglePaymentModel)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const switchOption = (option: string) => {
        setMenuOption(option)
    }

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
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} />
            <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className={"flex gap-6 bg-mid-grey p-[4px] items-center rounded-[12px]"}>
                    <div className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "events" && "bg-white rounded-[10px]"}`} onClick={() => switchOption("events")}>
                        <p className={`font-sans leading-[24px] ${menuOption==='events' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Events</p>
                    </div>
                    <div className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "organizer" && "bg-white rounded-[10px]"}`} onClick={() => switchOption("organizer")}>
                        <p className={`font-sans leading-[24px] ${menuOption==='organizer' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Organizer</p>
                    </div>
                    <div className={`px-[8px] p-[4px] cursor-pointer ${menuOption === "agent" && "bg-white rounded-[10px]"}`} onClick={() => switchOption("agent")}>
                        <p className={`font-sans leading-[24px] ${menuOption==='agent' ? "font-semibold text-[16px]" : "font-semi-normal text-[16px] text-text-grey"}`}>Agent</p>
                    </div>
                </div>
                {renderSubMenu()}
            </div>

            {renderView()}

        </section>
    );
}

export default EventPage;