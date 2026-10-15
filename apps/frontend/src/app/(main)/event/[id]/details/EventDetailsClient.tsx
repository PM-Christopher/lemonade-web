"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import DotIcon from "@/images/icons/dot.svg";
import MicIcon from "@/images/icons/microphone.svg";
import QrIcon from "@/images/icons/qr_code.svg";
import EditIcon from "@/images/icons/editIconBlack.svg";
import TicketIcon from "@/images/icons/ticket.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import AffiliateUsersIcon from "@/images/icons/affiliate_users.svg";
import CheckIcon from "@/images/icons/checkedFilledIcon.svg";
import PaymentSuccessfulModal, {
  type PaidPromotion,
} from "@/components/events/Modals/PaymentSuccessfulModal";
import type { PromotionPaymentMeta } from "@/features/events/api";
import PromotionDetailsModal from "@/components/events/Modals/PromotionDetailsModal";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useEventQuery, eventKeys } from "@/features/events/queries";
import { useEventPromotionMutation } from "@/features/events/mutations";
import { formatNumberWithCommas } from "@/lib/formatNumber";

import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { EventProgramDetailSkeleton } from "@/components/Skeletons";
import { usePaymentReturn } from "@/features/transaction/usePaymentReturn";
import { PromotionInterface } from "@/interfaces/EventInterface";
import { routes } from "@/lib/routes";

const EventDetailsClient = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: eventData, isLoading: loading } = useEventQuery(id);
  const event = eventData?.event;
  const { back } = useNavigation();
  const [promotionData, setPromotionData] = useState<PaidPromotion | null>(null);
  const [eventPromotion, setEventPromotion] = useState<PromotionInterface | null>(null);
  const eventPromotionMutation = useEventPromotionMutation();

  const activateModal = () => {
    setIsOpen(!isOpen);
  };

  const activateDetailsModal = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  usePaymentReturn<PromotionPaymentMeta>((meta) => {
    queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
    setPromotionData({ ...meta?.promo, promotion_date: meta?.promotion?.promotion_date });
    activateModal();
  });

  const handleGetEventPromotion = () => {
    eventPromotionMutation.mutate(
      { id: id, promotionId: event?.promotion?.[0]?.id ?? 0 },
      {
        onSuccess: (result) => {
          setEventPromotion(result.promotion as PromotionInterface);
          activateDetailsModal();
        },
      },
    );
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => back()}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Event details</p>
          </div>
        </div>
        {loading ? (
          <EventProgramDetailSkeleton />
        ) : (
          <div className="mt-4 flex flex-col items-center">
            <div className="flex justify-between gap-6">
              <div>
                <div className="flex w-160 flex-col rounded-xl bg-white p-6">
                  <div className="bg-green-tint/60 flex items-center gap-6 rounded-xl p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <FallbackImage
                        src={event?.event_image}
                        fallbackSrc={images.DEFAULT_EVENT}
                        alt={event?.event_name || "Event"}
                        width={120}
                        height={120}
                        className="h-30 w-30 rounded-lg object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Event name */}
                      <p className="text-title-r font-sans leading-tight font-semibold text-gray-900">
                        {event?.event_name}
                      </p>

                      {/* Date & time */}
                      <div className="text-text-grey flex flex-wrap items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-green-700" />
                        <p className="text-body-s">{formatLongDate(event?.start_date, "mid")}</p>
                        <DotIcon className="w-1 text-green-600" />
                        <p className="text-body-s">{formatTime(event?.start_date ?? null)}</p>
                        <span className="text-body-s">–</span>
                        <p className="text-body-s">{formatTime(event?.end_date ?? null)}</p>
                      </div>

                      {/* Location */}
                      <div className="text-text-grey flex items-center gap-2">
                        <LocationIcon className="h-4 w-4 text-green-700" />
                        <p className="text-body-s leading-6">{event?.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-8">
                    {(event?.promotion?.length ?? 0) > 0 ? (
                      <div
                        className="relative flex cursor-pointer flex-col items-center gap-2"
                        onClick={handleGetEventPromotion}
                      >
                        <div className="bg-light-green-60 absolute top-0 left-0 flex h-5 w-5 -translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full shadow-md">
                          <CheckIcon className="h-2.5 w-2.5" stroke="#009D44" />
                        </div>
                        <div className="border-grey-20 rounded-2xl border p-4">
                          <MicIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey text-meta font-sans">
                          Promoted
                        </p>
                      </div>
                    ) : (
                      <Link href={routes.EVENT_PROMOTE(id)}>
                        <div className="flex flex-col items-center gap-2">
                          <div className="border-grey-20 rounded-2xl border p-4">
                            <MicIcon />
                          </div>
                          <p className="font-semi-normal text-text-grey text-meta font-sans">
                            Promote
                          </p>
                        </div>
                      </Link>
                    )}
                    <Link href={routes.EVENT_GUEST_LIST(id)}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-grey-20 rounded-2xl border p-4">
                          <QrIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey text-meta font-sans">
                          Check in
                        </p>
                      </div>
                    </Link>
                    <Link href={routes.EVENT_EDIT(id)}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-grey-20 rounded-2xl border p-4">
                          <EditIcon />
                        </div>
                        <div>
                          <p className="font-semi-normal text-text-grey text-meta font-sans">
                            Edit event
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href={routes.EVENT_ADD_TICKET_ID(id)}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-grey-20 rounded-2xl border p-4">
                          <TicketIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey text-meta font-sans">
                          Add ticket
                        </p>
                      </div>
                    </Link>
                  </div>
                  <Link href={routes.EVENT_GUEST_LIST(id)}>
                    <div className="border-mid-grey mt-6 flex items-center justify-between rounded-xl border-2 p-3 px-4">
                      <div className="flex items-center gap-2">
                        <AffiliateUsersIcon />
                        <p className="font-semi-normal tracking-custom text-body-l font-sans">
                          Guest list
                        </p>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </Link>
                  <div className="border-mid-grey mt-6 flex flex-col rounded-xl border-2 p-4">
                    <div className="flex flex-col">
                      <p className="text-text-grey text-label font-sans font-normal">
                        Sales Revenue
                      </p>
                      <p className="tracking-custom text-black-light text-body-xl font-sans font-semibold">
                        ₦{formatNumberWithCommas(event?.breakdown?.sales_revenue)}
                      </p>
                    </div>
                    <div className="border-t-grey-20 my-4 border-t"></div>
                    <div className="flex flex-col">
                      <p className="text-text-grey text-label font-sans font-normal">
                        Tickets sold
                      </p>
                      <p className="tracking-custom text-black-light text-body-xl font-sans font-semibold">
                        {event?.breakdown?.tickets_sold?.sold}/
                        {event?.breakdown?.tickets_sold?.count}
                      </p>
                    </div>
                    <div className="border-t-grey-20 my-4 border-t"></div>
                    <div className="flex flex-col">
                      <p className="text-text-grey text-label font-sans font-normal">Check ins</p>
                      <p className="tracking-custom text-black-light text-body-xl font-sans font-semibold">
                        {event?.breakdown?.checkins?.percentage}%{" "}
                        <span className="font-normal">
                          ({event?.breakdown?.checkins?.count}/{event?.breakdown?.checkins?.total})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex w-120 flex-col rounded-lg bg-white p-4">
                  <p className="tracking-custom text-body-l font-sans font-semibold">
                    Sales revenue by ticket type
                  </p>
                  {(event?.sales_revenue?.sales_revenue_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.sales_revenue_breakdown?.map((ticket, idx: number) => {
                      const totalStock = Number(ticket?.stock) || 0;
                      const bought = Number(ticket?.bought) || 0;

                      const progressWidth =
                        ticket?.stock_type === "unlimited"
                          ? bought > 0
                            ? "100%"
                            : "0%"
                          : totalStock > 0
                            ? `${Math.min((bought / totalStock) * 100, 100)}%`
                            : "0%";

                      return (
                        <div key={idx}>
                          <p className="text-label mt-4 font-sans font-normal">{ticket?.name}</p>
                          <div className="mt-0.5 flex justify-between">
                            <p className="tracking-custom text-body-xl font-sans font-semibold">
                              ₦{formatNumberWithCommas(ticket?.price)}
                            </p>
                            <p className="font-semi-normal tracking-custom text-body-s font-sans">
                              {ticket?.bought}/
                              {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                            </p>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="bg-gradient-progress-green h-2 rounded-full"
                              style={{ width: progressWidth }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex w-120 flex-col rounded-lg bg-white p-4">
                  <p className="tracking-custom text-body-l font-sans font-semibold">
                    Ticket sold by ticket type
                  </p>

                  {(event?.sales_revenue?.tickets_sold_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.tickets_sold_breakdown?.map((ticket, idx: number) => {
                      const totalStock = Number(ticket?.stock) || 0;
                      const percentageSold = Number(ticket?.percentage_sold) || 0;

                      const progressWidth =
                        ticket?.stock_type === "unlimited"
                          ? (ticket?.bought ?? 0) > 0
                            ? "100%"
                            : "0%"
                          : totalStock > 0
                            ? `${Math.min((percentageSold / totalStock) * 100, 100)}%`
                            : "0%";

                      const percentageText =
                        ticket?.stock_type === "unlimited"
                          ? (ticket?.bought ?? 0) > 0
                            ? "100%"
                            : "0%"
                          : totalStock > 0
                            ? `${Math.min((percentageSold / totalStock) * 100, 100).toFixed(2)}%`
                            : "0%";
                      return (
                        <div key={idx}>
                          <p className="text-label mt-4 font-sans font-normal">{ticket?.name}</p>
                          <div className="mt-0.5 flex justify-between">
                            <p className="tracking-custom text-body-xl font-sans font-semibold">
                              {percentageText}
                            </p>
                            <p className="font-semi-normal tracking-custom text-body-s font-sans">
                              {ticket?.bought}/
                              {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                            </p>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="bg-gradient-progress-green h-2 rounded-full"
                              style={{ width: progressWidth }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex w-120 flex-col rounded-lg bg-white p-4">
                  <p className="tracking-custom text-body-l font-sans font-semibold">
                    Check ins by ticket type
                  </p>
                  {(event?.sales_revenue?.tickets_checkins_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.tickets_checkins_breakdown?.map((ticket, idx: number) => {
                      const totalStock = Number(ticket?.stock) || 0;
                      const checkinCount = Number(ticket?.checkin_count) || 0;

                      const progressWidth =
                        ticket?.stock_type === "unlimited"
                          ? checkinCount > 0
                            ? "100%"
                            : "0%"
                          : totalStock > 0
                            ? `${Math.min((checkinCount / totalStock) * 100, 100)}%`
                            : "0%";

                      const percentageText =
                        ticket?.stock_type === "unlimited"
                          ? checkinCount > 0
                            ? "100%"
                            : "0%"
                          : totalStock > 0
                            ? `${Math.min((checkinCount / totalStock) * 100, 100).toFixed(0)}%`
                            : "0%";

                      return (
                        <div key={idx}>
                          <p className="text-label mt-4 font-sans font-normal">{ticket?.name}</p>
                          <div className="mt-0.5 flex justify-between">
                            <p className="tracking-custom text-body-xl font-sans font-semibold">
                              {percentageText}
                            </p>
                            <p className="font-semi-normal tracking-custom text-body-s font-sans">
                              {ticket?.checkin_count}/
                              {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                            </p>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="bg-gradient-progress-green h-2 rounded-full"
                              style={{ width: progressWidth }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
        <PaymentSuccessfulModal toggle={activateModal} isOpen={isOpen} promotion={promotionData} />
        <PromotionDetailsModal
          toggle={activateDetailsModal}
          isOpen={isDetailsOpen}
          promotion={eventPromotion}
        />
      </section>
    </MainLayout>
  );
};

export default EventDetailsClient;
