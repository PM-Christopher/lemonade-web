"use client";
import React, { useEffect, useState } from "react";
import SideMenu from "@/components/events/SideMenu";
import EventsSectionView from "@/components/events/views/Events";
import OrganizerSectionView from "@/components/events/views/Organizer";
import EventSubMenu from "@/components/events/Menu/EventSubMenu";
import OrganizerSubMenu from "@/components/events/Menu/OrganizerSubMenu";
import AgentSectionView from "@/components/events/views/Agent";
import MainLayout from "@/components/layouts/MainLayout";
import TicketIcon from "@/images/icons/ticket.svg";
import SettingsIcon from "@/images/icons/settingsIcon.svg";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { eventKeys } from "@/features/events/queries";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { resetFreeEventState } from "@/features/events/event.slice";
import { useSearchEventsMutation, useFilterEventsMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { usePaymentReturn } from "@/features/transaction/usePaymentReturn";
import VerifyPaymentModal, {
  type VerifiedEvent,
} from "@/components/events/Modals/VerifyPaymentModal";
import { usePersistentMenuState } from "@/context/MenuStateProvider";
import useDebounce from "@/hooks/useDebounce";

// Off the initial bundle — only needed once the filter button is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const FilterEventModal = dynamic(() => import("@/components/events/Modals/FilterEventModal"), {
  ssr: false,
});

const EventListClient: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActive, getActive } = usePersistentMenuState();
  const persistedMenuOption = getActive("event") ?? "events";

  const [menuOption, setMenuOption] = useState(persistedMenuOption);
  const [seenMenu, setSeenMenu] = useState(persistedMenuOption);
  if (persistedMenuOption !== seenMenu) {
    setSeenMenu(persistedMenuOption);
    setMenuOption(persistedMenuOption);
  }

  const [togglePaymentModel, setTogglePaymentModel] = useState(false);
  const [toggleVPaymentModel, setToggleVPaymentModel] = useState(false);
  const [toggleFilterEvent, setToggleFilterEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { free_event } = useSelector((state: RootState) => state.event);
  const searchEventsMutation = useSearchEventsMutation();
  const { mutate: runSearch, reset: resetSearch } = searchEventsMutation;
  const searchResults = searchEventsMutation.data?.events ?? [];
  const { debouncedValue: debouncedSearch } = useDebounce(searchTerm.trim(), 350);
  const searchLoading = searchTerm.trim() !== debouncedSearch || searchEventsMutation.isPending;
  const filterEventsMutation = useFilterEventsMutation();

  const [paidEvent, setPaidEvent] = useState<VerifiedEvent>();

  const bookingCompleted = Boolean(free_event?.completed);
  const [seenBookingCompleted, setSeenBookingCompleted] = useState(bookingCompleted);
  if (bookingCompleted !== seenBookingCompleted) {
    setSeenBookingCompleted(bookingCompleted);
    if (bookingCompleted) setToggleVPaymentModel(true);
  }

  useEffect(() => {
    if (!free_event?.completed) return;
    dispatch(
      updateToastifyReducer({
        show: true,
        message: apiMessage("Event booked successfully"),
        type: "success",
      }),
    );
    dispatch(resetFreeEventState());
  }, [free_event, dispatch]);

  usePaymentReturn<VerifiedEvent["data"]>((data) => {
    setPaidEvent({ data });
    queryClient.invalidateQueries({ queryKey: eventKeys.myTickets() });
    dispatch(
      updateToastifyReducer({
        show: true,
        message: apiMessage("Event booked successfully"),
        type: "success",
      }),
    );
    setToggleVPaymentModel(true);
  });

  // Search runs once typing pauses, not on every keystroke.
  useEffect(() => {
    if (debouncedSearch) runSearch(debouncedSearch);
    else resetSearch();
  }, [debouncedSearch, runSearch, resetSearch]);

  const handleEventSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
          <EventsSectionView
            results={searchResults}
            searchTerm={searchTerm}
            searchLoading={searchLoading}
            filtered={filterEventsMutation.isSuccess}
            filteredEvents={filterEventsMutation.data?.events ?? []}
            filteredLoading={filterEventsMutation.isPending}
            onClearFilter={filterEventsMutation.reset}
          />
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
    setToggleVPaymentModel(!toggleVPaymentModel);
  };

  const toggleMoreTickets = () => {
    toggleMenu();
    toggleVerifyPayment();
    // setToggleVPaymentModel(false)
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <SideMenu toggleMenu={toggleMenu} isOpen={isOpen} />
        <div className="laptop:flex-row laptop:items-center laptop:px-16 flex flex-col justify-between gap-3 border-t border-b bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="bg-mid-grey relative inline-flex rounded-xl p-[0.35em] text-sm sm:text-base">
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
                { key: "events", label: "Events" },
                { key: "organizer", label: "Organizer" },
                { key: "agent", label: "Agent" },
              ].map((tab) => {
                const isActive = menuOption === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      switchOption(tab.key);
                      setActive("event", tab.key);
                    }}
                    className="relative z-10 flex w-1/3 items-center justify-center rounded-[0.7em] px-[1em] py-[0.55em]"
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

            {menuOption === "events" ? (
              <button
                type="button"
                aria-label="My tickets"
                className="laptop:hidden flex shrink-0 cursor-pointer"
                onClick={toggleMenu}
              >
                <TicketIcon className="h-4 w-5.75" />
              </button>
            ) : (
              menuOption === "organizer" && (
                <button
                  type="button"
                  aria-label="Payment settings"
                  className="laptop:hidden flex shrink-0 cursor-pointer"
                  onClick={toggleMenu}
                >
                  <SettingsIcon className="h-5.25 w-5.75" />
                </button>
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
        filterEventsMutation={filterEventsMutation}
      />
      <VerifyPaymentModal
        toggle={toggleVerifyPayment}
        isOpen={toggleVPaymentModel}
        event={paidEvent}
        toggleMore={toggleMoreTickets}
      />
    </MainLayout>
  );
};

export default EventListClient;
