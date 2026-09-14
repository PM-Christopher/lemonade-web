"use client";
import React, {useEffect} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatLongDate, formatLongTime} from "@/lib/dateTimeFormatter";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import {usePusher} from "@/hooks/usePusher";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import useNxtSearchParams from "@/hooks/useSearchParams";
import {useAppDispatch} from "@/redux/hook";
import {RootState} from "@/redux/store";
import {getEvent, setEventReferral} from "@/features/events/event.slice";
import {EventDetailsSkeleton} from "@/components/Skeletons";
import {useSearchParams} from "next/navigation";

const EventDetailsPage = ({params}: { params: { id: number } }) => {
    const dispatch = useAppDispatch()
    const {event, loading} = useSelector((state: RootState) => state.event)

    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("referral");
        if (!code) return;

        const eventId = Number(params.id);

        // Store in redux
        dispatch(setEventReferral({ eventId, code }));

        // Persist until payment completes (survives refresh)
        sessionStorage.setItem(`event_referral:${eventId}`, code);
    }, [dispatch, params.id, searchParams]);

    useEffect(() => {
        dispatch(getEvent({id: params.id}))
    }, []);

    const referralFromUrl = searchParams.get("referral");
    const buyTicketHref = referralFromUrl
        ? `/event/${event?.id}/buy-ticket?referral=${encodeURIComponent(referralFromUrl)}`
        : `/event/${event?.id}/buy-ticket`;

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                    <Link href="/event">
                        <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                            <ChevronLeft/>
                            <p className="font-sans font-semibold text-[16px] tracking-custom">
                                Event details
                            </p>
                        </div>
                    </Link>
                </div>

                {
                    loading ? (
                        <EventDetailsSkeleton/>
                    ) : (
                        <section className="mt-4 flex flex-col items-center">
                            <div className="flex justify-center w-full px-4">
                                <section
                                    className="flex flex-col laptop:flex-row items-start laptop:items-center gap-10 w-full laptop:max-w-[1100px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
                                    {/* Event Image */}
                                    <div className="w-full laptop:w-[480px]">
                                        <Image
                                            src={event?.event_image || "/images/default-event.jpg"}
                                            alt={event?.event_name || "Event image"}
                                            width={496}
                                            height={532}
                                            loading="lazy"
                                            className="w-full h-auto object-cover laptop:rounded-l-2xl"
                                        />
                                    </div>

                                    {/* Event Details */}
                                    <article
                                        className="flex flex-col justify-between w-full px-6 py-8 laptop:px-10 laptop:py-10 space-y-4">
                                        {/* Event Title */}
                                        <h1 className="font-sans font-semibold text-[22px] laptop:text-[32px] leading-snug text-gray-900">
                                            {event?.event_name}
                                        </h1>

                                        {/* Date */}
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <CalendarIcon className="text-gray-500"/>
                                            <p className="font-sans text-[16px]">
                                                {formatLongDate(event?.start_date, "mid")} –{" "}
                                                {formatLongDate(event?.end_date, "mid")}
                                            </p>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <ClockIcon className="text-gray-500"/>
                                            <p className="font-sans text-[16px]">
                                                {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
                                            </p>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <LocationIcon className="text-gray-500"/>
                                            <p className="font-sans text-[16px]">{event?.location}</p>
                                        </div>

                                        {/* Contact & Socials */}
                                        <div className="hidden laptop:flex flex-col space-y-3 pt-4">
                                            <p className="font-sans font-semibold text-[18px] text-gray-800">
                                                Contact Us
                                            </p>
                                            <div className="flex items-center gap-4">
                                                {[
                                                    {name: "facebook", icon: <FacebookIcon/>},
                                                    {name: "instagram", icon: <InstagramIcon/>},
                                                    {name: "linkedin", icon: <LinkedInIcon/>},
                                                    {name: "twitter", icon: <TwitterIcon/>},
                                                    {name: "website", icon: <AttachmentIcon/>},
                                                ].map((social, i) => {
                                                    const link =
                                                        event?.socials?.find((s: any) => s.name === social.name)?.value ??
                                                        "#";
                                                    return (
                                                        <a
                                                            key={i}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`Visit our ${social.name}`}
                                                            className="p-2 rounded-full bg-gray-100 hover:bg-green-50 hover:text-green-600 focus:ring-2 focus:ring-green-400 transition-colors"
                                                        >
                                                            {social.icon}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="hidden laptop:flex pt-6">
                                            <Link href={buyTicketHref} passHref>
                                                <Button
                                                    className="bg-gradient-green hover:opacity-90 w-[231px] h-[56px] rounded-[12px] border-b-2 border-transparent shadow-green-inset hover:shadow-green-inset-strong transition-all duration-300 flex items-center justify-center">
                                                    <span className="font-sans font-medium text-[16px] leading-[19.2px] text-white">
                                                        Buy ticket from ₦{event?.minimum_price}
                                                    </span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </article>
                                </section>
                            </div>


                            <div className="w-full mt-[40px] laptop:max-w-[1100px]">
                                <p className="font-sans font-semibold text-[24px] leading-[33.6px] text-gray-900">
                                    About Event
                                </p>
                                <div className="w-full mt-[16px] bg-gray-50 rounded-xl">
                                    <p className="font-sans font-normal text-[16px] leading-[24px] text-gray-700">
                                        {event?.event_description}
                                    </p>
                                </div>

                                {/* Contact + CTA (Mobile Only) */}
                                <div className="block laptop:hidden mt-[40px]">
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] text-gray-900">
                                        Contact Us
                                    </p>

                                    <div className="flex items-center gap-[16px] mt-[16px]">
                                        {[
                                            {name: 'facebook', icon: <FacebookIcon/>},
                                            {name: 'instagram', icon: <InstagramIcon/>},
                                            {name: 'linkedin', icon: <LinkedInIcon/>},
                                            {name: 'twitter', icon: <TwitterIcon/>},
                                            {name: 'website', icon: <AttachmentIcon/>},
                                        ].map((social, i) => {
                                            const link =
                                                event?.socials?.find((s: any) => s.name === social.name)?.value ?? '#';
                                            return (
                                                <a
                                                    key={i}
                                                    href={link}
                                                    target="_blank"
                                                    className=" p-2 rounded-full bg-gray-100 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 cursor-pointer"
                                                >
                                                    {social.icon}
                                                </a>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-[40px]">
                                        <Link href={buyTicketHref}>
                                            <Button
                                                className="bg-gradient-green hover:opacity-90 w-[231px] h-[56px] py-3.5 px-6 gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-bottomtransition-all duration-300"
                                            >
                                                <p className="font-sans font-medium text-[16px] leading-[19.2px] text-white">
                                                    Buy ticket from ₦{event?.minimum_price ?? '2,000'}
                                                </p>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }
            </section>
        </MainLayout>
    );
};

export default EventDetailsPage;
