"use client";
import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon, ChevronDown, ChevronRight, ClockIcon, MapPinIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEventDetailQuery } from "@/features/events/queries";
import type { EventTicket } from "@/features/events/api";
import { useApproveEventMutation } from "@/features/events/mutations";
import Link from "next/link";
import { AvatarName } from "@/components/global/AvatarName";
import { SocialLink } from "@/components/global/SocialLink";
import { routes } from "@/lib/routes";
import { naira } from "@/views/transactions/transactionFormat";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
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
const UnsuspendModal = dynamic(() => import("@/modals/events/UnsuspendModal"), {
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
  const [unsuspendOpen, setUnsuspendOpen] = useState(false);

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

  const approveEventMutation = useApproveEventMutation(id);

  const approveEvent = () => {
    if (isLoggedIn && id) {
      approveEventMutation.mutate();
    }
  };

  const status = event?.event?.status;
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  // The organiser's social links, shown as badges.
  const rawSocials = event?.event?.socials;
  const socialLinks = (
    Array.isArray(rawSocials) ? (rawSocials as Array<{ name?: string; value?: string }>) : []
  ).filter((link): link is { name: string; value: string } => Boolean(link.name && link.value));

  return (
    <>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div className={"flex h-fit w-full shrink-0 flex-col rounded-xl bg-white lg:w-150"}>
          <div className={"flex items-center justify-between border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Event summary</p>
            {isPending || isRejected ? (
              <div className={"flex gap-3"}>
                {isPending && (
                  <button
                    className={"border-red-2 bg-red-1 h-11 w-31 rounded-xl border text-center"}
                    onClick={toggleRejectModalOpen}
                  >
                    <p className={"text-body-l font-medium text-white"}>Reject</p>
                  </button>
                )}
                <button
                  className={"bg-gradient-green h-11 w-31 rounded-xl border text-center"}
                  onClick={approveEvent}
                  disabled={approveEventMutation.isPending}
                >
                  <p className={"text-body-l font-medium text-white"}>Approve</p>
                </button>
              </div>
            ) : event?.event?.status !== "ACTIVE" ? (
              <button
                className={"bg-gradient-green h-11 w-39 rounded-xl border text-center"}
                onClick={() => setUnsuspendOpen(true)}
              >
                <p className={"text-body-l font-medium text-white"}>
                  {status === "SUSPENDED" ? "Unsuspend event" : "Reactivate event"}
                </p>
              </button>
            ) : (
              <div className="relative inline-block">
                <div
                  className={
                    "border-light-grey-50 flex items-center gap-2 rounded-xl border p-2.5 px-3.5"
                  }
                  onClick={handleToggleDropdown}
                >
                  <p className={"text-body-s font-medium"}>Flag event</p>
                  <ChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 z-50 w-51.75 rounded-xl bg-white shadow">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={toggleSuspendModalOpen}
                      >
                        <p className={"text-body-l font-normal"}>Suspend event</p>
                      </li>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={toggleDeleteModalOpen}
                      >
                        <p className={"text-red-1 text-body-l font-normal"}>Delete event</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Event Owner:
                </p>
              </div>
              <div className={"flex gap-1"}>
                <AvatarName
                  name={event?.event?.owner?.fullname}
                  image={event?.event?.owner?.image}
                />
                {event?.event?.owner?.id && (
                  <Link
                    href={routes.USER_DETAIL(event.event.owner.id)}
                    className={"text-light-green-70 text-body-s ml-2 font-medium whitespace-nowrap"}
                  >
                    View profile
                  </Link>
                )}
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Event ID:</p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.event?.unique_id ?? "N/A"}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Event Status:
                </p>
              </div>
              <p
                className={`text-body-s font-medium ${GetStatusClass(capitalizeWords(event?.event?.status))}`}
              >
                {capitalizeWords(event?.event?.status)}
              </p>
            </div>
            {isRejected && event?.event?.rejection_reason ? (
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Rejection reason:
                  </p>
                </div>
                <p className={"text-red-1 text-body-s font-medium"}>
                  {event.event.rejection_reason}
                </p>
              </div>
            ) : null}
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Date Created:
                </p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-body-s font-medium"}>{event?.event?.created_at}</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Event Category:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.event?.category}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Payment Settings:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>
                {event?.event?.payment_settings
                  ? capitalizeWords(event.event.payment_settings)
                  : "Not set"}
              </p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Account Number:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.event?.account?.account_number}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Account Holder:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.event?.account?.name}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>Bank Name:</p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.event?.account?.bank}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Ticket Revenue:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{naira(event?.event?.ticket_revenue)}</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Ticket Class:
                </p>
              </div>
              <p className={"text-body-s font-medium"}>{event?.tickets.length}</p>
            </div>
            {event?.tickets.map((ticket: EventTicket, index: number) => (
              <div className={"bg-light-grey flex flex-col gap-2 rounded-xl p-3"} key={index}>
                <p className={"font-semiBold text-body-l"}>
                  {capitalizeWords(ticket?.ticket_type)}
                </p>
                <p className={"text-light-black text-meta leading-normal font-normal"}>
                  {ticket?.description}
                </p>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>Price:</p>
                  </div>
                  <p className={"text-body-s font-medium"}>
                    {Number(ticket?.price) === 0 ? "-" : naira(ticket?.price)}
                  </p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>
                      Ticket Stock:
                    </p>
                  </div>
                  <p className={"text-body-s font-medium"}>{capitalizeWords(ticket?.stock_type)}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>
                      Purchase Limit:
                    </p>
                  </div>
                  <p className={"text-body-s font-medium"}>{ticket?.purchase_limit}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>
                      Tickets Sold:
                    </p>
                  </div>
                  <p className={"text-body-s font-medium"}>{ticket?.tickets_sold}</p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>
                      Sales Revenue:
                    </p>
                  </div>
                  <p className={"text-body-s font-medium"}>
                    {Number(ticket?.sales_revenue) === 0
                      ? "-"
                      : `₦${Number(ticket?.sales_revenue).toLocaleString()}`}
                  </p>
                </div>
                <div className={"items-center-center flex gap-6"}>
                  <div className={"w-28.75"}>
                    <p className={"text-text-grey text-meta leading-normal font-medium"}>
                      Check-Ins:
                    </p>
                  </div>
                  <p className={"text-body-s font-medium"}>{ticket?.check_ins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div
          className={
            "w-195 h-fit bg-white rounded-tr-xl rounded-tl-xl flex flex-col p-6 gap-4"
          }
        > */}

        <div
          className={
            "flex h-190.5 w-full flex-col gap-4 rounded-tl-xl rounded-tr-xl bg-white p-6 lg:min-w-0 lg:flex-1"
          }
        >
          {status === "SUSPENDED" && (
            <p
              className={
                "bg-red-1 text-meta ml-auto w-fit rounded px-2 py-0.5 font-medium text-white"
              }
            >
              Suspended
            </p>
          )}
          {event?.event?.event_image && (
            <Image
              src={event.event.event_image}
              alt={event.event.event_name ?? ""}
              width={320}
              height={343}
              className={"h-85.75 w-80 rounded-2xl"}
            />
          )}
          <p className={"font-semiBold text-title-r leading-normal"}>{event?.event?.event_name}</p>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex items-center gap-2"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-body-s font-medium"}>{event?.event?.event_date}</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-body-s font-medium"}>{event?.event?.event_time}</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <MapPinIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-body-s font-medium"}>{event?.event?.location}</p>
            </div>
          </div>
          {socialLinks.length > 0 && (
            <>
              <p className={"font-semiBold text-body-l"}>Contact Us</p>
              <div className={"flex gap-3"}>
                {socialLinks.map((link) => (
                  <SocialLink key={link.name} name={link.name} href={link.value} />
                ))}
              </div>
            </>
          )}
          <p className={"font-semiBold text-body-l"}>About Event</p>
          <p className={"text-text-grey text-body-s font-normal"}>{event?.event?.description}</p>
          {(event?.event?.promotions.length ?? 0) > 0 && (
            <>
              <p className={"font-semiBold text-body-l"}>Promotions</p>
              <div className={"flex flex-wrap gap-3"}>
                {event?.event?.promotions.map((promotion) => (
                  <Link
                    key={promotion.id}
                    href={routes.EVENT_PROMOTIONS(promotion.id)}
                    className={
                      "border-light-green-tint bg-light-tint flex w-fit items-center rounded-xl border p-2"
                    }
                  >
                    <p className={"text-body-s font-medium"}>{promotion.name}</p>
                    <ChevronRight className={"text-grey-40 w-5"} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <SuspendModal isOpen={suspendModalOpen} toggle={toggleSuspendModalOpen} id={id} />
      <DeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModalOpen} id={id} />
      <UnsuspendModal isOpen={unsuspendOpen} toggle={() => setUnsuspendOpen(false)} id={id} />
      <RejectEventModal isOpen={rejectModalOpen} toggle={toggleRejectModalOpen} id={id} />
    </>
  );
};

export default EventDetailsClient;
