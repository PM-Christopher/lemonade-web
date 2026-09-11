"use client";
import React, {useEffect, useState} from "react";
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
import CheckIcon from "@/images/icons/checkedFilledIcon.svg"
import PaymentSuccessfulModal from "@/components/events/Modals/PaymentSuccessfulModal";
import PromotionDetailsModal from "@/components/events/Modals/PromotionDetailsModal";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import {useRouter, useSearchParams} from "next/navigation";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {getEvent, getEventPromotion} from "@/features/events/event.slice";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {formatLongDate, formatLongTime, formatTime} from "@/lib/dateTimeFormatter";
import {EventProgramDetailSkeleton} from "@/components/Skeletons";
import {verifyTransaction} from "@/features/transaction/transaction.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {PromotionInterface} from "@/interfaces/EventInterface";

const EventDetailsPage = ({params}: { params: { id: number } }) => {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const {event, loading} = useSelector((state: any) => state.event)
    const router = useRouter();
    const searchParams = useSearchParams();
    const trxref = searchParams.get('trxref');
    const [promotionData, setPromotionData] = useState<PromotionInterface | null>(null)
    const [eventPromotion, setEventPromotion] = useState(null)

    const activateModal = () => {
        setIsOpen(!isOpen);
    };

    const activateDetailsModal = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };

    useEffect(() => {
        if (params?.id) {
            dispatch(getEvent({id: params.id}))
        }
    }, []);

    useEffect(() => {
        if (trxref) {
            dispatch(verifyTransaction({data: {trx_ref: trxref}}))
                .unwrap()
                .then((res) => {
                    // Remove trxref from URL
                    const params = new URLSearchParams(searchParams);
                    params.delete('trxref');
                    params.delete('reference');
                    // Update the URL without reloading
                    router.replace(`?${params.toString()}`);
                    const promotion_data = {
                        ...res?.data?.data?.promo,
                        promotion_date: res?.data?.data?.promotion?.promotion_date
                    }
                    setPromotionData(promotion_data)
                    activateModal()
                })
                .catch((err) => {
                    console.error('Payment verification failed:', err);
                });
        }
    }, [trxref, dispatch, searchParams, router]);

    const handleGetEventPromotion = async () => {
        const res = await dispatch(getEventPromotion({id: params.id, promotion_id: event?.promotion[0]?.id}))
        if (res.payload.status) {
            setEventPromotion(res?.payload?.data?.promotion)
            activateDetailsModal()
        }
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Event details
                        </p>
                    </div>
                </div>
                {
                    loading ? (
                        <EventProgramDetailSkeleton />
                    ) : (
                        <div className="mt-4 flex flex-col items-center">
                            <div className="flex justify-between gap-[24px]">
                                <div>
                                    <div className="w-[640px] p-[24px] rounded-[12px] bg-white flex flex-col">
                                        <div className="flex items-center gap-6 p-4 rounded-xl bg-green-tint/60  shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="relative overflow-hidden rounded-lg shadow-md">
                                                <Image
                                                    src={event?.event_image}
                                                    alt={event?.event_name || "Event"}
                                                    width={120}
                                                    height={120}
                                                    className="w-[120px] h-[120px] object-cover rounded-lg"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {/* Event name */}
                                                <p className="font-sans font-semibold text-[20px] text-gray-900 leading-tight">
                                                    {event?.event_name}
                                                </p>

                                                {/* Date & time */}
                                                <div className="flex items-center flex-wrap gap-2 text-text-grey">
                                                    <CalendarIcon className="w-4 h-4 text-green-700" />
                                                    <p className="text-[15px]">{formatLongDate(event?.start_date, "mid")}</p>
                                                    <DotIcon className="w-1 text-green-600" />
                                                    <p className="text-[15px]">{formatTime(event?.start_date)}</p>
                                                    <span className="text-[15px]">–</span>
                                                    <p className="text-[15px]">{formatTime(event?.end_date)}</p>
                                                </div>

                                                {/* Location */}
                                                <div className="flex items-center gap-2 text-text-grey">
                                                    <LocationIcon className="w-4 h-4 text-green-700" />
                                                    <p className="text-[15px] leading-[24px]">{event?.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center mt-[24px] gap-8">
                                            {
                                                event?.promotion?.length > 0 ? (
                                                    <div className="flex flex-col items-center gap-[8px] cursor-pointer relative" onClick={handleGetEventPromotion}>
                                                        <div className="absolute top-0 left-0 w-[20px] h-[20px] bg-light-green-60 rounded-full flex items-center justify-center -translate-x-1/3 -translate-y-1/3 shadow-md">
                                                            <CheckIcon className="w-[10px] h-[10px]" stroke='#009D44' />
                                                        </div>
                                                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                            <MicIcon />
                                                        </div>
                                                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                                                            Promoted
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <Link href={`/event/${params.id}/promote-event`}>
                                                        <div className="flex flex-col items-center gap-[8px]">
                                                            <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                                <MicIcon/>
                                                            </div>
                                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                                                                Promote
                                                            </p>
                                                        </div>
                                                    </Link>
                                                )
                                            }
                                            <Link href={`/event/${params.id}/guest-list`}>
                                                <div className="flex flex-col items-center gap-[8px]">
                                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                        <QrIcon/>
                                                    </div>
                                                    <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                                                        Check in
                                                    </p>
                                                </div>
                                            </Link>
                                            <Link href={`/event/${params.id}/edit-event`}>
                                                <div className="flex flex-col items-center gap-[8px]">
                                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                        <EditIcon/>
                                                    </div>
                                                    <div>
                                                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                                                            Edit event
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href={`/event/${params.id}/add-ticket`}>
                                                <div className="flex flex-col items-center gap-[8px]">
                                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                        <TicketIcon/>
                                                    </div>
                                                    <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                                                        Add ticket
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <Link href={"/event/5/guest-list"}>
                                            <div
                                                className="flex justify-between items-center p-[12px] px-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                                                <div className="flex items-center gap-2">
                                                    <AffiliateUsersIcon/>
                                                    <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom">
                                                        Guest list
                                                    </p>
                                                </div>
                                                <ChevronRightIcon/>
                                            </div>
                                        </Link>
                                        <div
                                            className="flex flex-col p-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                                            <div className="flex flex-col">
                                                <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                                                    Sales Revenue
                                                </p>
                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                                                    ₦{event?.breakdown?.sales_revenue}
                                                </p>
                                            </div>
                                            <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                                            <div className="flex flex-col">
                                                <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                                                    Tickets sold
                                                </p>
                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                                                    {event?.breakdown?.tickets_sold?.sold}/{event?.breakdown?.tickets_sold?.count}
                                                </p>
                                            </div>
                                            <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                                            <div className="flex flex-col">
                                                <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                                                    Check ins
                                                </p>
                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                                                    {event?.breakdown?.checkins?.percentage}% <span
                                                    className="font-normal">({event?.breakdown?.checkins?.count}/{event?.breakdown?.checkins?.total})</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                        <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                            Sales revenue by ticket type
                                        </p>
                                        {
                                            event?.sales_revenue?.sales_revenue_breakdown?.length > 0 && (
                                                event?.sales_revenue?.sales_revenue_breakdown?.map((ticket: any, idx: number) => {
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
                                                            <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                                                {ticket?.name}
                                                            </p>
                                                            <div className="flex justify-between mt-[2px]">
                                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                                                    ₦{formatNumberWithCommas(ticket?.price)}
                                                                </p>
                                                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                                                    {ticket?.bought}/{ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                                                                </p>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                                                <div
                                                                    className="bg-gradient-progress-green h-[8px] rounded-full"
                                                                    style={{ width: progressWidth }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )
                                        }

                                    </div>
                                    <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                        <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                            Ticket sold by ticket type
                                        </p>

                                        {
                                            event?.sales_revenue?.tickets_sold_breakdown?.length > 0 && (
                                                event?.sales_revenue?.tickets_sold_breakdown?.map((ticket: any, idx: number) => {
                                                    const totalStock = Number(ticket?.stock) || 0;
                                                    const percentageSold = Number(ticket?.percentage_sold) || 0;

                                                    const progressWidth =
                                                        ticket?.stock_type === "unlimited"
                                                            ? ticket?.bought > 0
                                                                ? "100%"
                                                                : "0%"
                                                            : totalStock > 0
                                                                ? `${Math.min((percentageSold / totalStock) * 100, 100)}%`
                                                                : "0%"

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
                                                            <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                                                {ticket?.name}
                                                            </p>
                                                            <div className="flex justify-between mt-[2px]">
                                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                                                    {percentageText}
                                                                </p>
                                                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                                                    {ticket?.bought}/{ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                                                                </p>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                                                <div
                                                                    className="bg-gradient-progress-green h-[8px] rounded-full"
                                                                    style={{width: progressWidth}}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }


                                    </div>
                                    <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                        <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                            Check ins by ticket type
                                        </p>
                                        {
                                            event?.sales_revenue?.tickets_checkins_breakdown?.length > 0 && (
                                                event?.sales_revenue?.tickets_checkins_breakdown?.map((ticket: any, idx: number) => {
                                                    const totalStock = Number(ticket?.stock) || 0;
                                                    const checkinCount = Number(ticket?.checkin_count) || 0;

                                                    const progressWidth =
                                                        ticket?.stock_type === "unlimited"
                                                            ? checkinCount > 0
                                                                ? "100%"
                                                                : "0%"
                                                            : totalStock > 0
                                                                ? `${Math.min((checkinCount / totalStock) * 100, 100)}%`
                                                                : "0%"

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
                                                            <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                                                {ticket?.name}
                                                            </p>
                                                            <div className="flex justify-between mt-[2px]">
                                                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                                                    {percentageText}
                                                                </p>
                                                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                                                    {ticket?.checkin_count}/{ticket?.stock_type === "unlimited" ? "∞" : ticket?.stock}
                                                                </p>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                                                <div
                                                                    className="bg-gradient-progress-green h-[8px] rounded-full"
                                                                    style={{ width: progressWidth }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                <PaymentSuccessfulModal toggle={activateModal} isOpen={isOpen} promotion={promotionData}/>
                <PromotionDetailsModal
                    toggle={activateDetailsModal}
                    isOpen={isDetailsOpen}
                    promotion={eventPromotion}
                />
            </section>
        </MainLayout>
    );
};

export default EventDetailsPage;
