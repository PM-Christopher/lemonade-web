"use client";
import React, { useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
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
import PaymentSuccessfulModal from "@/components/events/Modals/PaymentSuccessfulModal";
import PromotionDetailsModal from "@/components/events/Modals/PromotionDetailsModal";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useQueryClient } from "@tanstack/react-query";
import { useEventQuery, eventKeys } from "@/features/events/queries";
import { useEventPromotionMutation } from "@/features/events/mutations";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { getSafeImageSrc } from "@/lib/helper";
import { formatLongDate, formatLongTime, formatTime } from "@/lib/dateTimeFormatter";
import { EventProgramDetailSkeleton } from "@/components/Skeletons";
import { useVerifyTransactionMutation } from "@/features/transaction/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { PromotionInterface } from "@/interfaces/EventInterface";

const EventDetailsClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: eventData, isLoading: loading } = useEventQuery(id);
  const event = eventData?.event;
  const router = useRouter();
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const [promotionData, setPromotionData] = useState<PromotionInterface | null>(null);
  const [eventPromotion, setEventPromotion] = useState(null);
  const verifyTransactionMutation = useVerifyTransactionMutation();
  const eventPromotionMutation = useEventPromotionMutation();

  const activateModal = () => {
    setIsOpen(!isOpen);
  };

  const activateDetailsModal = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  useEffect(() => {
    if (trxref) {
      verifyTransactionMutation.mutate(
        { trx_ref: trxref },
        {
          onSuccess: (res: any) => {
            queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
            // Remove trxref from URL
            const params_ = new URLSearchParams(searchParams);
            params_.delete("trxref");
            params_.delete("reference");
            // Update the URL without reloading
            router.replace(`?${params_.toString()}`);
            const promotion_data = {
              ...res?.data?.promo,
              promotion_date: res?.data?.promotion?.promotion_date,
            };
            setPromotionData(promotion_data);
            activateModal();
          },
          onError: (err) => {
            console.error("Payment verification failed:", err);
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trxref]);

  const handleGetEventPromotion = () => {
    eventPromotionMutation.mutate(
      { id: id, promotionId: event?.promotion?.[0]?.id ?? 0 },
      {
        onSuccess: (result) => {
          setEventPromotion(result.promotion as any);
          activateDetailsModal();
        },
      },
    );
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[12px] px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Event details</p>
          </div>
        </div>
        {loading ? (
          <EventProgramDetailSkeleton />
        ) : (
          <div className="mt-4 flex flex-col items-center">
            <div className="flex justify-between gap-[24px]">
              <div>
                <div className="flex w-[640px] flex-col rounded-[12px] bg-white p-[24px]">
                  <div className="bg-green-tint/60 flex items-center gap-6 rounded-xl p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={getSafeImageSrc(event?.event_image, "/images/default-event.jpg")}
                        alt={event?.event_name || "Event"}
                        width={120}
                        height={120}
                        className="h-[120px] w-[120px] rounded-lg object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Event name */}
                      <p className="font-sans text-[20px] leading-tight font-semibold text-gray-900">
                        {event?.event_name}
                      </p>

                      {/* Date & time */}
                      <div className="text-text-grey flex flex-wrap items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-green-700" />
                        <p className="text-[15px]">{formatLongDate(event?.start_date, "mid")}</p>
                        <DotIcon className="w-1 text-green-600" />
                        <p className="text-[15px]">{formatTime(event?.start_date ?? null)}</p>
                        <span className="text-[15px]">–</span>
                        <p className="text-[15px]">{formatTime(event?.end_date ?? null)}</p>
                      </div>

                      {/* Location */}
                      <div className="text-text-grey flex items-center gap-2">
                        <LocationIcon className="h-4 w-4 text-green-700" />
                        <p className="text-[15px] leading-[24px]">{event?.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[24px] flex items-center justify-center gap-8">
                    {(event?.promotion?.length ?? 0) > 0 ? (
                      <div
                        className="relative flex cursor-pointer flex-col items-center gap-[8px]"
                        onClick={handleGetEventPromotion}
                      >
                        <div className="bg-light-green-60 absolute top-0 left-0 flex h-[20px] w-[20px] -translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full shadow-md">
                          <CheckIcon className="h-[10px] w-[10px]" stroke="#009D44" />
                        </div>
                        <div className="border-grey-20 rounded-[16px] border-[1px] p-[16px]">
                          <MicIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                          Promoted
                        </p>
                      </div>
                    ) : (
                      <Link href={`/event/${id}/promote-event`}>
                        <div className="flex flex-col items-center gap-[8px]">
                          <div className="border-grey-20 rounded-[16px] border-[1px] p-[16px]">
                            <MicIcon />
                          </div>
                          <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                            Promote
                          </p>
                        </div>
                      </Link>
                    )}
                    <Link href={`/event/${id}/guest-list`}>
                      <div className="flex flex-col items-center gap-[8px]">
                        <div className="border-grey-20 rounded-[16px] border-[1px] p-[16px]">
                          <QrIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                          Check in
                        </p>
                      </div>
                    </Link>
                    <Link href={`/event/${id}/edit-event`}>
                      <div className="flex flex-col items-center gap-[8px]">
                        <div className="border-grey-20 rounded-[16px] border-[1px] p-[16px]">
                          <EditIcon />
                        </div>
                        <div>
                          <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                            Edit event
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href={`/event/${id}/add-ticket`}>
                      <div className="flex flex-col items-center gap-[8px]">
                        <div className="border-grey-20 rounded-[16px] border-[1px] p-[16px]">
                          <TicketIcon />
                        </div>
                        <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
                          Add ticket
                        </p>
                      </div>
                    </Link>
                  </div>
                  <Link href={"/event/5/guest-list"}>
                    <div className="border-mid-grey mt-[24px] flex items-center justify-between rounded-[12px] border-[2px] p-[12px] px-[16px]">
                      <div className="flex items-center gap-2">
                        <AffiliateUsersIcon />
                        <p className="font-semi-normal tracking-custom font-sans text-[16px] leading-[24px]">
                          Guest list
                        </p>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </Link>
                  <div className="border-mid-grey mt-[24px] flex flex-col rounded-[12px] border-[2px] p-[16px]">
                    <div className="flex flex-col">
                      <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                        Sales Revenue
                      </p>
                      <p className="tracking-custom text-black-light font-sans text-[18px] leading-[27px] font-semibold">
                        ₦{event?.breakdown?.sales_revenue}
                      </p>
                    </div>
                    <div className="border-t-grey-20 my-4 border-t-[1px]"></div>
                    <div className="flex flex-col">
                      <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                        Tickets sold
                      </p>
                      <p className="tracking-custom text-black-light font-sans text-[18px] leading-[27px] font-semibold">
                        {event?.breakdown?.tickets_sold?.sold}/
                        {event?.breakdown?.tickets_sold?.count}
                      </p>
                    </div>
                    <div className="border-t-grey-20 my-4 border-t-[1px]"></div>
                    <div className="flex flex-col">
                      <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                        Check ins
                      </p>
                      <p className="tracking-custom text-black-light font-sans text-[18px] leading-[27px] font-semibold">
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
                <div className="flex w-[480px] flex-col rounded-[8px] bg-white p-[16px]">
                  <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                    Sales revenue by ticket type
                  </p>
                  {(event?.sales_revenue?.sales_revenue_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.sales_revenue_breakdown?.map(
                      (ticket: any, idx: number) => {
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
                            <p className="mt-[16px] font-sans text-[14px] leading-[16.8px] font-normal">
                              {ticket?.name}
                            </p>
                            <div className="mt-[2px] flex justify-between">
                              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                                ₦{formatNumberWithCommas(ticket?.price)}
                              </p>
                              <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                                {ticket?.bought}/
                                {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                              </p>
                            </div>
                            <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200">
                              <div
                                className="bg-gradient-progress-green h-[8px] rounded-full"
                                style={{ width: progressWidth }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                </div>
                <div className="flex w-[480px] flex-col rounded-[8px] bg-white p-[16px]">
                  <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                    Ticket sold by ticket type
                  </p>

                  {(event?.sales_revenue?.tickets_sold_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.tickets_sold_breakdown?.map(
                      (ticket: any, idx: number) => {
                        const totalStock = Number(ticket?.stock) || 0;
                        const percentageSold = Number(ticket?.percentage_sold) || 0;

                        const progressWidth =
                          ticket?.stock_type === "unlimited"
                            ? ticket?.bought > 0
                              ? "100%"
                              : "0%"
                            : totalStock > 0
                              ? `${Math.min((percentageSold / totalStock) * 100, 100)}%`
                              : "0%";

                        const percentageText =
                          ticket?.stock_type === "unlimited"
                            ? ticket?.bought > 0
                              ? "100%"
                              : "0%"
                            : totalStock > 0
                              ? `${Math.min((percentageSold / totalStock) * 100, 100).toFixed(2)}%`
                              : "0%";
                        return (
                          <div key={idx}>
                            <p className="mt-[16px] font-sans text-[14px] leading-[16.8px] font-normal">
                              {ticket?.name}
                            </p>
                            <div className="mt-[2px] flex justify-between">
                              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                                {percentageText}
                              </p>
                              <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                                {ticket?.bought}/
                                {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                              </p>
                            </div>
                            <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200">
                              <div
                                className="bg-gradient-progress-green h-[8px] rounded-full"
                                style={{ width: progressWidth }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                </div>
                <div className="flex w-[480px] flex-col rounded-[8px] bg-white p-[16px]">
                  <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                    Check ins by ticket type
                  </p>
                  {(event?.sales_revenue?.tickets_checkins_breakdown?.length ?? 0) > 0 &&
                    event?.sales_revenue?.tickets_checkins_breakdown?.map(
                      (ticket: any, idx: number) => {
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
                            <p className="mt-[16px] font-sans text-[14px] leading-[16.8px] font-normal">
                              {ticket?.name}
                            </p>
                            <div className="mt-[2px] flex justify-between">
                              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                                {percentageText}
                              </p>
                              <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                                {ticket?.checkin_count}/
                                {ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                              </p>
                            </div>
                            <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200">
                              <div
                                className="bg-gradient-progress-green h-[8px] rounded-full"
                                style={{ width: progressWidth }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
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
