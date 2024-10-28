"use client"
import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg"
import event_det_image from "@/image/event_images/event_details.png"
import Image from "next/image";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import ClockIcon from "@/image/icons/clock.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import AttachmentIcon from "@/image/icons/attachments.svg"
import FacebookIcon from "@/image/icons/facebook-color.svg"
import InstagramIcon from "@/image/icons/instagram-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatDate, formatLongDate, formatLongTime} from "@/lib/dateTimeFormatter";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

const EventDetailsPage = ({params}: {params: {id: number}}) => {
    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`/events/${params.id}`, "GET", {}, true, getHeader())
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <Link href="/event">
                            <ChevronLeft/>
                        </Link>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Event details</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <div className="flex justify-center">
                        <div className="flex items-center gap-[48px] min-w-[1000px] bg-white rounded-[16px] p-[4px]">
                            <Image src={data?.event?.event_image} alt="event details" width={496} height={531.91}/>
                            <div>
                                <p className="mb-[24px] font-sans font-semibold text-[32px] leading-[44.8px]">
                                    {data?.event?.event_name}
                                </p>
                                <div className="flex items-center gap-2 my-2">
                                    <CalendarIcon/>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] tracking-custom text-text-grey">
                                        {formatLongDate(data?.event?.start_date, "mid")}
                                    </p>
                                    <p>-</p>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] tracking-custom text-text-grey">
                                        {formatLongDate(data?.event?.end_date, "mid")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-[24px]">
                                    <ClockIcon/>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">
                                        {formatLongTime(data?.event?.start_date)}
                                    </p>
                                    <p>-</p>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">
                                        {formatLongTime(data?.event?.end_date)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-[24px]">
                                    <LocationIcon/>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">
                                        {data?.event?.location}
                                    </p>
                                </div>
                                <p className="mt-[40px] font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Contact
                                    Us</p>
                                <div className="flex items-center gap-[16px] mt-[16px]">
                                    <FacebookIcon/>
                                    <InstagramIcon/>
                                    <LinkedInIcon/>
                                    <TwitterIcon/>
                                    <AttachmentIcon/>
                                </div>
                                <div className="mt-[40px]">
                                    <Link href={`/event/${data?.event?.id}/buy-ticket`}>
                                        <Button
                                            className={"bg-gradient-green w-[231px] h-[56px] py-3.5 px-6 gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-top shadow-custom-bottom"}>
                                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Buy
                                                ticket
                                                from
                                                ₦2,000</p>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-[1000px] mt-[40px]">
                        <p className="font-sans font-semibold text-[24px] leading-[33.6px]">About Event</p>
                        <div className="w-[720px] mt-[16px]">
                            <p className="font-sans font-normal text-[16px] leading-[24px] text-light-black mt-2">
                                {data?.event?.event_description}
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default EventDetailsPage;