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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import {resetFreeEventState, searchEvent} from "@/features/events/event.slice";
import {useRouter, useSearchParams} from "next/navigation";
import {verifyTribePayment} from "@/features/tribes/tribe.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {verifyTransaction} from "@/features/transaction/transaction.slice";
import VerifyPaymentModal from "@/components/events/Modals/VerifyPaymentModal";

const EventPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOption, setMenuOption] = useState("events");
  const [togglePaymentModel, setTogglePaymentModel] = useState(false);
  const [toggleVPaymentModel, setToggleVPaymentModel] = useState(false);
  const [toggleFilterEvent, setToggleFilterEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { searchResults, free_event } = useSelector((state: RootState) => state.event);
  const { authToken } = useSelector((state: any) => state.auth);

  const router = useRouter()
  const searchParams = useSearchParams();
  const trxref = searchParams.get('trxref');
  const {transaction_data, loading: transaction_loading} = useSelector((state: RootState) => state.transaction);

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
      dispatch(verifyTransaction({data: {trx_ref: trxref}, token: authToken}))
          .unwrap()
          .then((res) => {
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
          })
          .catch((err) => {
            console.error('Payment verification failed:', err);
          });
    }
  }, [trxref, dispatch, searchParams, router]);


  const handleEventSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchEvent({ data: { search: value } }));
  };

  const activatePaymentModal = () => {
    setTogglePaymentModel(!togglePaymentModel);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const activateFilterEvent = () => {
    setToggleFilterEvent(!toggleFilterEvent);
  };

  const renderView = () => {
    switch (menuOption) {
      case "events":
        return (
          <EventsSectionView results={searchResults} searchTerm={searchTerm} />
        );
      case "organizer":
        return (
          <OrganizerSectionView
            activatePaymentModal={activatePaymentModal}
            togglePaymentModel={togglePaymentModel}
          />
        );
      case "agent":
        return <AgentSectionView />;
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
        return <OrganizerSubMenu toggle={activatePaymentModal} />;
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
        <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} />
        <div className="bg-white flex justify-between py-5 border-t-[1px] border-b-[1px] laptop:items-center flex-col laptop:flex-row gap-2 pr-[10px]">
          <div className="flex justify-between items-center px-[16px]">
            <div
              className={
                "flex gap-6 bg-mid-grey p-[4px] items-center rounded-[12px]"
              }
            >
              <div
                className={`px-[8px] p-[4px] cursor-pointer ${
                  menuOption === "events" && "bg-white rounded-[10px]"
                }`}
                onClick={() => switchOption("events")}
              >
                <p
                  className={`font-sans leading-[24px] ${
                    menuOption === "events"
                      ? "font-semibold text-[16px]"
                      : "font-semi-normal text-[16px] text-text-grey"
                  }`}
                >
                  Events
                </p>
              </div>
              <div
                className={`px-[8px] p-[4px] cursor-pointer ${
                  menuOption === "organizer" && "bg-white rounded-[10px]"
                }`}
                onClick={() => switchOption("organizer")}
              >
                <p
                  className={`font-sans leading-[24px] ${
                    menuOption === "organizer"
                      ? "font-semibold text-[16px]"
                      : "font-semi-normal text-[16px] text-text-grey"
                  }`}
                >
                  Organizer
                </p>
              </div>
              <div
                className={`px-[8px] p-[4px] cursor-pointer ${
                  menuOption === "agent" && "bg-white rounded-[10px]"
                }`}
                onClick={() => switchOption("agent")}
              >
                <p
                  className={`font-sans leading-[24px] ${
                    menuOption === "agent"
                      ? "font-semibold text-[16px]"
                      : "font-semi-normal text-[16px] text-text-grey"
                  }`}
                >
                  Agent
                </p>
              </div>
            </div>
            {menuOption === "events" ? (
              <div
                className="cursor-pointer flex laptop:hidden"
                onClick={toggleMenu}
              >
                <TicketIcon className="w-[23px] h-[16px]" />
              </div>
            ) : (
              menuOption === "organizer" && (
                <div
                  className="cursor-pointer flex laptop:hidden"
                  onClick={toggleMenu}
                >
                  <SettingsIcon className="w-[23px] h-[21px]" />
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
      <VerifyPaymentModal toggle={toggleVerifyPayment} isOpen={toggleVPaymentModel} event={transaction_data} toggleMore={toggleMoreTickets} />
    </MainLayout>
  );
};

export default EventPage;
