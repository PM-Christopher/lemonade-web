"use client";
import React, {useEffect, useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import SideMenu from "@/components/events/SideMenu";
import EventsSectionView from "@/components/events/views/Events";
import OrganizerSectionView from "@/components/events/views/Organizer";
import EventSubMenu from "@/components/events/Menu/EventSubMenu";
import OrganizerSubMenu from "@/components/events/Menu/OrganizerSubMenu";
import AgentSectionView from "@/components/events/views/Agent";
import MainLayout from "@/components/layouts/MainLayout";
import TicketIcon from "@/images/icons/ticket.svg";
import SettingsIcon from "@/images/icons/settingsIcon.svg";
import FilterEventModal from "@/components/events/Modals/FilterEventModal";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {resetFreeEventState, searchEvent} from "@/features/events/event.slice";
import {useRouter, useSearchParams} from "next/navigation";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useVerifyTransactionMutation} from "@/features/transaction/mutations";
import VerifyPaymentModal from "@/components/events/Modals/VerifyPaymentModal";
import {usePersistentMenuState} from "@/context/MenuStateProvider";

const EventPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {setActive, getActive, selectedMenu} = usePersistentMenuState()
    const persistedMenuOption = getActive("event") ?? "events";

    const [menuOption, setMenuOption] = useState(persistedMenuOption);
    // ✅ Sync local state when persisted value changes
    useEffect(() => {
        setMenuOption(persistedMenuOption);
    }, [persistedMenuOption]);

    const [togglePaymentModel, setTogglePaymentModel] = useState(false);
    const [toggleVPaymentModel, setToggleVPaymentModel] = useState(false);
    const [toggleFilterEvent, setToggleFilterEvent] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useAppDispatch();
    const {searchResults, free_event} = useSelector((state: RootState) => state.event);

    const router = useRouter()
    const searchParams = useSearchParams();
    const trxref = searchParams.get('trxref');
    const verifyTransactionMutation = useVerifyTransactionMutation();
    const transaction_data = verifyTransactionMutation.data;

    useEffect(() => {
        if (free_event) {
            if (free_event.completed) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Event booked successfully",
                        type: "success",
                    })
                );
                setToggleVPaymentModel(true)
                dispatch(resetFreeEventState())
            }
        }
    }, [free_event]);

    useEffect(() => {
        if (trxref) {
            verifyTransactionMutation.mutate({trx_ref: trxref}, {
                onSuccess: () => {
                    // Remove trxref from URL
                    const params = new URLSearchParams(searchParams);
                    params.delete('trxref');
                    params.delete('reference');
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Event booked successfully",
                            type: "success",
                        })
                    );
                    setToggleVPaymentModel(true)
                    // Update the URL without reloading
                    router.replace(`?${params.toString()}`);
                },
                onError: (err) => {
                    console.error('Payment verification failed:', err);
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trxref]);


    const handleEventSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        dispatch(searchEvent({data: {search: value}}));
    };

    const activatePaymentModal = () => {
        setTogglePaymentModel(!togglePaymentModel);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const switchOption = (option: string) => {
        setMenuOption(option);
        setActive("event", option);
    };

    const activateFilterEvent = () => {
        setToggleFilterEvent(!toggleFilterEvent);
    };

    const renderView = () => {
        switch (menuOption) {
            case "events":
                return (
                    <EventsSectionView results={searchResults} searchTerm={searchTerm}/>
                );
            case "organizer":
                return (
                    <OrganizerSectionView
                        activatePaymentModal={activatePaymentModal}
                        togglePaymentModel={togglePaymentModel}
                    />
                );
            case "agent":
                return <AgentSectionView/>;
        }
    };

    const renderSubMenu = () => {
        switch (menuOption) {
            case "events":
                return (
                    <EventSubMenu
                        toggleMenu={toggleMenu}
                        searchTerm={searchTerm}
                        handleEventSearch={handleEventSearch}
                        filterEvent={activateFilterEvent}
                    />
                );
            case "organizer":
                return <OrganizerSubMenu toggle={activatePaymentModal}/>;
        }
    };

    const toggleVerifyPayment = () => {
        setToggleVPaymentModel(!toggleVPaymentModel)
    }

    const toggleMoreTickets = () => {
        toggleMenu()
        toggleVerifyPayment()
        // setToggleVPaymentModel(false)
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <SideMenu toggleMenu={toggleMenu} isOpen={isOpen}/>
                <div
                    className="bg-white flex justify-between py-[8px] px-[64px] border-t-[1px] border-b-[1px] laptop:items-center flex-col laptop:flex-row">
                    <div className="flex justify-between items-center px-[16px]">
                        <div className="relative inline-flex rounded-xl bg-mid-grey p-[0.35em] text-sm sm:text-base">
                            {/* Sliding pill */}
                            <span
                                className={[
                                    "absolute inset-[0.35em] w-[calc(33.333%-0.233em)] rounded-[0.7em] bg-white",
                                    "transition-transform duration-300 ease-out",
                                    menuOption === "organizer"
                                        ? "translate-x-full"
                                        : menuOption === "agent"
                                            ? "translate-x-[200%]"
                                            : "translate-x-0",
                                ].join(" ")}
                            />

                            {[
                                {key: "events", label: "Events"},
                                {key: "organizer", label: "Organizer"},
                                {key: "agent", label: "Agent"},
                            ].map((tab) => {
                                const isActive = menuOption === tab.key;

                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => {
                                            switchOption(tab.key)
                                            setActive("event", tab.key)
                                        }}
                                        className="relative z-10 w-1/3 rounded-[0.7em] px-[1em] py-[0.55em] flex items-center justify-center"
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

                        {menuOption === "events" ? (
                            <div
                                className="cursor-pointer flex laptop:hidden"
                                onClick={toggleMenu}
                            >
                                <TicketIcon className="w-[23px] h-[16px]"/>
                            </div>
                        ) : (
                            menuOption === "organizer" && (
                                <div
                                    className="cursor-pointer flex laptop:hidden"
                                    onClick={toggleMenu}
                                >
                                    <SettingsIcon className="w-[23px] h-[21px]"/>
                                </div>
                            )
                        )}
                    </div>
                    {renderSubMenu()}
                </div>

                {renderView()}
            </section>
            <FilterEventModal
                toggle={activateFilterEvent}
                isOpen={toggleFilterEvent}
            />
            <VerifyPaymentModal toggle={toggleVerifyPayment} isOpen={toggleVPaymentModel} event={transaction_data}
                                toggleMore={toggleMoreTickets}/>
        </MainLayout>
    );
};

export default EventPage;
