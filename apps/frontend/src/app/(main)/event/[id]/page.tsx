"use client";
import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { formatLongDate, formatLongTime } from "@/lib/dateTimeFormatter";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { useAppDispatch } from "@/redux/hook";
import { setEventReferral } from "@/features/events/event.slice";
import { useEventQuery } from "@/features/events/queries";
import { EventDetailsSkeleton } from "@/components/Skeletons";
import { useSearchParams } from "next/navigation";

const EventDetailsPage = ({ params }: { params: { id: number } }) => {
  const dispatch = useAppDispatch();
  const { data: eventData, isLoading: loading } = useEventQuery(params.id);
  const event = eventData?.event;

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

  const referralFromUrl = searchParams.get("referral");
  const buyTicketHref = referralFromUrl
    ? `/event/${event?.id}/buy-ticket?referral=${encodeURIComponent(referralFromUrl)}`
    : `/event/${event?.id}/buy-ticket`;

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-5 px-10">
          <Link href="/event">
            <div className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]">
              <ChevronLeft />
              <p className="font-sans text-[16px] font-semibold tracking-custom">Event details</p>
            </div>
          </Link>
        </div>

        {loading ? (
          <EventDetailsSkeleton />
        ) : (
          <section className="mt-4 flex flex-col items-center">
            <div className="flex w-full justify-center px-4">
              <section className="flex w-full flex-col items-start gap-10 overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md laptop:max-w-[1100px] laptop:flex-row laptop:items-center">
                {/* Event Image */}
                <div className="w-full laptop:w-[480px]">
                  <Image
                    src={event?.event_image || "/images/default-event.jpg"}
                    alt={event?.event_name || "Event image"}
                    width={496}
                    height={532}
                    loading="lazy"
                    className="h-auto w-full object-cover laptop:rounded-l-2xl"
                  />
                </div>

                {/* Event Details */}
                <article className="flex w-full flex-col justify-between space-y-4 px-6 py-8 laptop:px-10 laptop:py-10">
                  {/* Event Title */}
                  <h1 className="font-sans text-[22px] font-semibold leading-snug text-gray-900 laptop:text-[32px]">
                    {event?.event_name}
                  </h1>

                  {/* Date */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarIcon className="text-gray-500" />
                    <p className="font-sans text-[16px]">
                      {formatLongDate(event?.start_date, "mid")} –{" "}
                      {formatLongDate(event?.end_date, "mid")}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <ClockIcon className="text-gray-500" />
                    <p className="font-sans text-[16px]">
                      {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <LocationIcon className="text-gray-500" />
                    <p className="font-sans text-[16px]">{event?.location}</p>
                  </div>

                  {/* Contact & Socials */}
                  <div className="hidden flex-col space-y-3 pt-4 laptop:flex">
                    <p className="font-sans text-[18px] font-semibold text-gray-800">Contact Us</p>
                    <div className="flex items-center gap-4">
                      {[
                        { name: "facebook", icon: <FacebookIcon /> },
                        { name: "instagram", icon: <InstagramIcon /> },
                        { name: "linkedin", icon: <LinkedInIcon /> },
                        { name: "twitter", icon: <TwitterIcon /> },
                        { name: "website", icon: <AttachmentIcon /> },
                      ].map((social, i) => {
                        const link =
                          event?.socials?.find((s: any) => s.name === social.name)?.value ?? "#";
                        return (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit our ${social.name}`}
                            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-green-50 hover:text-green-600 focus:ring-2 focus:ring-green-400"
                          >
                            {social.icon}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="hidden pt-6 laptop:flex">
                    <Link href={buyTicketHref} passHref>
                      <Button className="flex h-[56px] w-[231px] items-center justify-center rounded-[12px] border-b-2 border-transparent bg-gradient-green shadow-green-inset transition-all duration-300 hover:opacity-90 hover:shadow-green-inset-strong">
                        <span className="font-sans text-[16px] font-medium leading-[19.2px] text-white">
                          Buy ticket from ₦{event?.minimum_price}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </article>
              </section>
            </div>

            <div className="mt-[40px] w-full laptop:max-w-[1100px]">
              <p className="font-sans text-[24px] font-semibold leading-[33.6px] text-gray-900">
                About Event
              </p>
              <div className="mt-[16px] w-full rounded-xl bg-gray-50">
                <p className="font-sans text-[16px] font-normal leading-[24px] text-gray-700">
                  {event?.event_description}
                </p>
              </div>

              {/* Contact + CTA (Mobile Only) */}
              <div className="mt-[40px] block laptop:hidden">
                <p className="font-sans text-[18px] font-semibold leading-[27px] text-gray-900">
                  Contact Us
                </p>

                <div className="mt-[16px] flex items-center gap-[16px]">
                  {[
                    { name: "facebook", icon: <FacebookIcon /> },
                    { name: "instagram", icon: <InstagramIcon /> },
                    { name: "linkedin", icon: <LinkedInIcon /> },
                    { name: "twitter", icon: <TwitterIcon /> },
                    { name: "website", icon: <AttachmentIcon /> },
                  ].map((social, i) => {
                    const link =
                      event?.socials?.find((s: any) => s.name === social.name)?.value ?? "#";
                    return (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        className="cursor-pointer rounded-full bg-gray-100 p-2 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
                      >
                        {social.icon}
                      </a>
                    );
                  })}
                </div>

                <div className="mt-[40px]">
                  <Link href={buyTicketHref}>
                    <Button className="shadow-custom-bottomtransition-all h-[56px] w-[231px] gap-2 rounded-[12px] border-b-2 border-transparent bg-gradient-green px-6 py-3.5 duration-300 hover:opacity-90">
                      <p className="font-sans text-[16px] font-medium leading-[19.2px] text-white">
                        Buy ticket from ₦{event?.minimum_price ?? "2,000"}
                      </p>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </MainLayout>
  );
};

export default EventDetailsPage;
