"use client";
import React, { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, ChevronRight, ClockIcon, MapPinIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEventDetailQuery } from "@/features/events/queries";
import { useActivateEventMutation } from "@/features/events/mutations";
import { capitalizeWords } from "@/utils/helper";
import Image from "next/image";
import SuspendModal from "@/modals/events/SuspendModal";
import DeleteModal from "@/modals/events/DeleteModal";

const Page = ({}) => {
  const params = useParams();
  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: event } = useEventDetailQuery(id, { enabled: isLoggedIn });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

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

  const activateEventMutation = useActivateEventMutation(id);

  const unsuspendEvent = () => {
    if (isLoggedIn && id) {
      activateEventMutation.mutate();
    }
  };

  return (
    <MainLayout>
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        <div className={"flex h-fit w-[800px] flex-col rounded-[12px] bg-white"}>
          <div className={"flex items-center justify-between border-b-[1px] p-[24px]"}>
            <p className={"text-[16px] font-semiBold"}>Event summary</p>
            {event?.event?.status !== "ACTIVE" ? (
              <button
                className={
                  "h-[44px] w-[156px] rounded-[12px] border-[1px] bg-gradient-green text-center"
                }
                onClick={unsuspendEvent}
              >
                <p className={"text-[16px] font-medium text-white"}>Reactivate event</p>
              </button>
            ) : (
              <div className="relative inline-block">
                <div
                  className={
                    "flex items-center gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 p-[10px] px-[14px]"
                  }
                  onClick={handleToggleDropdown}
                >
                  <p className={"text-[14px] font-medium"}>Flag event</p>
                  <ChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 w-[207px] rounded-[12px] bg-white shadow">
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
                        <p className={"text-[16px] font-normal text-red-1"}>Delete event</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={"flex flex-col gap-[20px] p-[24px]"}>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Owner:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{event?.event?.owner?.fullname}</p>
                {/* <p className={"text-[14px] font-medium text-light-green"}>
                  View profile
                </p> */}
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>EV112332</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Status:</p>
              </div>
              <p className={"text-[14px] font-medium text-light-green-70"}>
                {capitalizeWords(event?.event?.status)}
              </p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Date Created:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>{event?.event?.created_at}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Category:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.category}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Payment Settings:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Monthly</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Account Number:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.account_number}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Account Holder:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.name}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Bank Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.event?.account?.bank}</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Ticket Revenue:</p>
              </div>
              <p className={"text-[14px] font-medium"}>N300,000</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Ticket Class:</p>
              </div>
              <p className={"text-[14px] font-medium"}>{event?.tickets.length}</p>
            </div>
            {event?.tickets.map((ticket: any, index: any) => (
              <div
                className={"flex flex-col gap-[8px] rounded-[12px] bg-light-grey p-[12px]"}
                key={index}
              >
                <p className={"text-[16px] font-semiBold"}>
                  {capitalizeWords(ticket?.ticket_type)}
                </p>
                <p className={"text-[12px] font-normal text-light-black"}>{ticket?.description}</p>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Price:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>
                    {ticket?.price === 0 ? "-" : ticket?.price}
                  </p>
                </div>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Ticket Stock:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{capitalizeWords(ticket?.stock_type)}</p>
                </div>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Purchase Limit:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.purchase_limit}</p>
                </div>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Tickets Sold:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.tickets_sold}</p>
                </div>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Sales Revenue:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>
                    {ticket?.sales_revenue === 0 ? "-" : ticket?.sales_revenue}
                  </p>
                </div>
                <div className={"items-center-center flex gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>Check-Ins:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>{ticket?.check_ins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div
          className={
            "w-[780px] h-fit bg-white rounded-tr-[12px] rounded-tl-[12px] flex flex-col p-[24px] gap-[16px]"
          }
        > */}

        <div
          className={
            "lg:w-2/3 flex h-[762px] w-full flex-col gap-[16px] rounded-tl-[12px] rounded-tr-[12px] bg-white p-[24px]"
          }
        >
          <Image
            src={event?.event?.event_image ?? ""}
            alt={event?.event?.event_name ?? ""}
            width={320}
            height={343}
            className={"h-[343px] w-[320px] rounded-[16px]"}
          />
          <p className={"text-[20px] font-semiBold"}>{event?.event?.event_name}</p>
          <div className={"flex flex-col gap-[8px]"}>
            <div className={"flex items-center gap-[8px]"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>{event?.event?.event_date}</p>
            </div>
            <div className={"flex items-center gap-[8px]"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>{event?.event?.event_time}</p>
            </div>
            <div className={"flex items-center gap-[8px]"}>
              <MapPinIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>{event?.event?.location}</p>
            </div>
          </div>
          <p className={"text-[16px] font-semiBold"}>Contact Us</p>
          <p className={"text-[16px] font-semiBold"}>About Event</p>
          <p className={"text-[14px] font-normal text-text-grey"}>{event?.event?.description}</p>
          <p className={"text-[16px] font-semiBold"}>Promotions</p>
          <div className={"flex flex-wrap gap-[12px]"}>
            <div
              className={
                "flex w-fit items-center gap-[] rounded-[12px] border-[1px] border-light-green-tint bg-light-tint p-[8px]"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Feed</p>
              <ChevronRight className={"w-[20px] text-grey-40"} />
            </div>
            <div
              className={
                "flex w-fit items-center gap-[] rounded-[12px] border-[1px] border-light-green-tint bg-light-tint p-[8px]"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Story</p>
              <ChevronRight className={"w-[20px] text-grey-40"} />
            </div>
          </div>
        </div>
      </section>
      <SuspendModal isOpen={suspendModalOpen} toggle={toggleSuspendModalOpen} id={id} />
      <DeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModalOpen} id={id} />
    </MainLayout>
  );
};

export default Page;
