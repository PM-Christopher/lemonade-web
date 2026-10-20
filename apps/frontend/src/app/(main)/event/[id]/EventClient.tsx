"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { images } from "@/lib/images";
import React, { useEffect } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import { Button } from "@lemonade/ui";
import { formatLongDate, formatLongTime } from "@/lib/dateTimeFormatter";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { useAppDispatch } from "@/redux/hook";
import { setEventReferral } from "@/features/events/event.slice";
import { useEventQuery } from "@/features/events/queries";
import { EventDetailsSkeleton } from "@/components/Skeletons";
import { useSearchParams } from "next/navigation";

import { routes } from "@/lib/routes";

const EventClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const { data: eventData, isLoading: loading } = useEventQuery(id);
  const event = eventData?.event;

  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("referral");
    if (!code) return;

    const eventId = String(id);

    // Store in redux
    dispatch(setEventReferral({ eventId, code }));

    // Persist until payment completes (survives refresh)
    sessionStorage.setItem(`event_referral:${eventId}`, code);
  }, [dispatch, id, searchParams]);

  const referralFromUrl = searchParams.get("referral");
  const buyTicketHref = referralFromUrl
    ? `/event/${event?.id}/buy-ticket?referral=${encodeURIComponent(referralFromUrl)}`
    : `/event/${event?.id}/buy-ticket`;

  // Free events say so instead of "from ₦0".
  const minimumPrice = event?.minimum_price;
  const ticketLabel =
    minimumPrice == null
      ? "Buy ticket"
      : minimumPrice === 0
        ? "Get free ticket"
        : `Buy ticket from ₦${formatNumberWithCommas(minimumPrice)}`;

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between bg-white p-5 px-10">
          <Link href={routes.EVENT}>
            <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
              <ChevronLeft />
              <p className="tracking-custom text-body-l font-sans font-semibold">Event details</p>
            </div>
          </Link>
        </div>

        {loading ? (
          <EventDetailsSkeleton />
        ) : (
          <section className="mt-4 flex flex-col items-center">
            <div className="flex w-full justify-center px-4">
              <section className="laptop:max-w-275 laptop:flex-row laptop:items-center laptop:gap-10 laptop:p-4 flex w-full flex-col overflow-hidden rounded-2xl bg-white">
                {/* Event Image */}
                <div className="laptop:w-100 laptop:shrink-0 laptop:rounded-xl relative aspect-4/5 w-full overflow-hidden">
                  <FallbackImage
                    src={event?.event_image}
                    fallbackSrc={images.DEFAULT_EVENT}
                    alt={event?.event_name || "Event image"}
                    fill
                    priority
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* Event Details */}
                <article className="laptop:px-0 laptop:py-6 flex w-full flex-col space-y-4 px-6 py-6">
                  {/* Event Title */}
                  <h1 className="laptop:text-title-xl laptop:leading-normal text-title-r font-sans leading-snug font-semibold text-gray-900">
                    {event?.event_name}
                  </h1>

                  {/* Date */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarIcon className="text-gray-500" />
                    <p className="text-body-l font-sans">
                      {formatLongDate(event?.start_date, "mid")} –{" "}
                      {formatLongDate(event?.end_date, "mid")}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <ClockIcon className="text-gray-500" />
                    <p className="text-body-l font-sans">
                      {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <LocationIcon className="text-gray-500" />
                    <p className="text-body-l font-sans">{event?.location}</p>
                  </div>

                  {/* Contact & Socials */}
                  <div className="laptop:flex hidden flex-col space-y-3 pt-4">
                    <p className="text-body-xl font-sans font-semibold text-gray-800">Contact Us</p>
                    <div className="flex items-center gap-4">
                      {[
                        { name: "facebook", icon: <FacebookIcon /> },
                        { name: "instagram", icon: <InstagramIcon /> },
                        { name: "linkedin", icon: <LinkedInIcon /> },
                        { name: "twitter", icon: <TwitterIcon /> },
                        { name: "website", icon: <AttachmentIcon /> },
                      ].map((social, i) => {
                        const link =
                          event?.socials?.find((s) => s.name === social.name)?.value ?? "#";
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
                  <div className="laptop:flex hidden pt-6">
                    <Link href={buyTicketHref} passHref>
                      <Button className="bg-gradient-green flex h-14 w-57.75 items-center justify-center rounded-xl border-b-2 border-transparent transition-all duration-300 hover:opacity-90">
                        <span className="text-field font-sans font-medium text-white">
                          {ticketLabel}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </article>
              </section>
            </div>

            <div className="laptop:max-w-275 mt-10 w-full">
              <p className="text-title-l font-sans font-semibold text-gray-900">About Event</p>
              <div className="mt-4 w-full rounded-xl bg-gray-50">
                <p className="text-body-l font-sans font-normal text-gray-700">
                  {event?.event_description}
                </p>
              </div>

              {/* Contact + CTA (Mobile Only) */}
              <div className="laptop:hidden mt-10 block">
                <p className="text-body-xl font-sans font-semibold text-gray-900">Contact Us</p>

                <div className="mt-4 flex items-center gap-4">
                  {[
                    { name: "facebook", icon: <FacebookIcon /> },
                    { name: "instagram", icon: <InstagramIcon /> },
                    { name: "linkedin", icon: <LinkedInIcon /> },
                    { name: "twitter", icon: <TwitterIcon /> },
                    { name: "website", icon: <AttachmentIcon /> },
                  ].map((social, i) => {
                    const link = event?.socials?.find((s) => s.name === social.name)?.value ?? "#";
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

                <div className="mt-10">
                  <Link href={buyTicketHref}>
                    <Button className="bg-gradient-green h-14 w-57.75 gap-2 rounded-xl border-b-2 border-transparent px-6 py-3.5 transition-all duration-300 hover:opacity-90">
                      <p className="text-field font-sans font-medium text-white">{ticketLabel}</p>
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

export default EventClient;
