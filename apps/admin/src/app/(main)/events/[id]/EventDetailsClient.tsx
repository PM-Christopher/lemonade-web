"use client";
import React, { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, ChevronRight, ClockIcon, MapPinIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEventDetailQuery } from "@/features/events/queries";
import type { EventTicket } from "@/features/events/api";
import { useActivateEventMutation, useApproveEventMutation } from "@/features/events/mutations";
import { capitalizeWords } from "@/utils/helper";
import Image from "next/image";
import dynamic from "next/dynamic";

// Off the initial bundle — both are only needed once their triggering
// action fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const SuspendModal = dynamic(() => import("@/modals/events/SuspendModal"), {
  ssr: false,
});
const DeleteModal = dynamic(() => import("@/modals/events/DeleteModal"), {
  ssr: false,
});
const RejectEventModal = dynamic(() => import("@/modals/events/RejectEventModal"), {
  ssr: false,
});

const EventDetailsClient = ({ id }: { id: string }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: event } = useEventDetailQuery(id, { enabled: isLoggedIn });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: Event) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, []);

  const toggleSuspendModalOpen = () => {
    setSuspendModalOpen(!suspendModalOpen);
  };

  const toggleDeleteModalOpen = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const toggleRejectModalOpen = () => {
    setRejectModalOpen(!rejectModalOpen);
  };

  const activateEventMutation = useActivateEventMutation(id);
  const approveEventMutation = useApproveEventMutation(id);

  const unsuspendEvent = () => {
    if (isLoggedIn && id) {
      activateEventMutation.mutate();
    }
  };

  const approveEvent = () => {
    if (isLoggedIn && id) {
      approveEventMutation.mutate();
    }
  };

  const status = event?.event?.status;
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-col">
        <div className={"flex h-fit w-[800px] flex-col rounded-xl bg-white"}>
          <div className={"flex items-center justify-between border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Event summary</p>
            {isPending || isRejected ? (
              <div className={"flex gap-3"}>
                {isPending && (
                  <button
                    className={"border-red-2 bg-red-1 h-11 w-[124px] rounded-xl border text-center"}
                    onClick={toggleRejectModalOpen}
                  >
                    <p className={"text-[16px] font-medium text-white"}>Reject</p>
                  </button>
                )}
                <button
                  className={"bg-gradient-green h-11 w-[124px] rounded-xl border text-center"}
                  onClick={approveEvent}
                  disabled={approveEventMutation.isPending}
                >
                  <p className={"text-[16px] font-medium text-white"}>Approve</p>
                </button>
              </div>
            ) : event?.event?.status !== "ACTIVE" ? (
              <button
                className={"bg-gradient-green h-11 w-[156px] rounded-xl border text-center"}
                onClick={unsuspendEvent}
              >
                <p className={"text-[16px] font-medium text-white"}>Reactivate event</p>
              </button>
            ) : (
              <div className="relative inline-block">
                <div
                  className={
                    "border-light-grey-50 flex items-center gap-2 rounded-xl border p-2.5 px-3.5"
                  }
                  onClick={handleToggleDropdown}
                >
                  <p className={"text-[14px] font-medium"}>Flag event</p>
                  <ChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 z-50 w-[207px] rounded-xl bg-white shadow">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={toggleSuspendModalOpen}
                      >
                        <p className={"text-[16px] font-normal"}>Suspend event</p>
                      </li>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={toggleDeleteModalOpen}
                      >
                        <p className={"text-red-1 text-[16px] font-normal"}>Delete event</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event Owner:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{event?.event?.owner?.fullname}</p>
                {/* <p className={"text-[14px] font-medium text-light-green"}>
                  View profile
                </p> */}
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>EV112332</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event Status:</p>
              </div>
              <p className={"text-light-green-70 text-[14px] font-medium"}>
                {capitalizeWords(event?.event?.status)}
              </p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Date Created:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>{event?.event?.created_at}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event Category:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.category}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Payment Settings:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Monthly</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Account Number:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.account_number}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Account Holder:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.name}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Bank Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.bank}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Ticket Revenue:</p>
              </div>
              <p className={"text-[14px] font-medium"}>N300,000</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Ticket Class:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.tickets.length}</p>
            </div>
            {event?.tickets.map((ticket: EventTicket, index: number) => (
              <div className={"bg-light-grey flex flex-col gap-2 rounded-xl p-3"} key={index}>
                <p className={"font-semiBold text-[16px]"}>
                  {capitalizeWords(ticket?.ticket_type)}
                </p>
                <p className={"text-light-black text-[12px] font-normal"}>{ticket?.description}</p>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Price:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>
                    {ticket?.price === 0 ? "-" : ticket?.price}
                  </p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Ticket Stock:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{capitalizeWords(ticket?.stock_type)}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Purchase Limit:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.purchase_limit}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Tickets Sold:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.tickets_sold}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Sales Revenue:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>
                    {ticket?.sales_revenue === 0 ? "-" : ticket?.sales_revenue}
                  </p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Check-Ins:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.check_ins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div
          className={
            "w-[780px] h-fit bg-white rounded-tr-xl rounded-tl-xl flex flex-col p-6 gap-4"
          }
        > */}

        <div
          className={
            "flex h-[762px] w-full flex-col gap-4 rounded-tl-xl rounded-tr-xl bg-white p-6 lg:w-2/3"
          }
        >
          <Image
            src={event?.event?.event_image ?? ""}
            alt={event?.event?.event_name ?? ""}
            width={320}
            height={343}
            className={"h-[343px] w-80 rounded-2xl"}
          />
          <p className={"font-semiBold text-[20px]"}>{event?.event?.event_name}</p>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex items-center gap-2"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>{event?.event?.event_date}</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>{event?.event?.event_time}</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <MapPinIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>{event?.event?.location}</p>
            </div>
          </div>
          <p className={"font-semiBold text-[16px]"}>Contact Us</p>
          <p className={"font-semiBold text-[16px]"}>About Event</p>
          <p className={"text-text-grey text-[14px] font-normal"}>{event?.event?.description}</p>
          <p className={"font-semiBold text-[16px]"}>Promotions</p>
          <div className={"flex flex-wrap gap-3"}>
            <div
              className={
                "gap-[] border-light-green-tint bg-light-tint flex w-fit items-center rounded-xl border p-2"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Feed</p>
              <ChevronRight className={"text-grey-40 w-5"} />
            </div>
            <div
              className={
                "gap-[] border-light-green-tint bg-light-tint flex w-fit items-center rounded-xl border p-2"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Story</p>
              <ChevronRight className={"text-grey-40 w-5"} />
            </div>
          </div>
        </div>
      </section>
      <SuspendModal isOpen={suspendModalOpen} toggle={toggleSuspendModalOpen} id={id} />
      <DeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModalOpen} id={id} />
      <RejectEventModal isOpen={rejectModalOpen} toggle={toggleRejectModalOpen} id={id} />
    </MainLayout>
  );
};

export default EventDetailsClient;
