"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";

import { Button } from "@lemonade/ui";
import AffiliateLinkModal from "@/components/events/Modals/AffiliateLinkModal";

import { useAppDispatch } from "@/redux/hook";
import { useAffiliateEventDetailQuery } from "@/features/events/queries";
import { useGenerateAffiliateLinkMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { formatLongDate, formatLongTime } from "@/lib/dateTimeFormatter";

type SocialIconName =
  "facebook" | "instagram" | "linkedin" | "twitter" | "website";

const ICON_MAP: Record<SocialIconName, React.JSX.Element> = {
  facebook: <FacebookIcon className="h-5 w-5" />,
  instagram: <InstagramIcon className="h-5 w-5" />,
  linkedin: <LinkedInIcon className="h-5 w-5" />,
  twitter: <TwitterIcon className="h-5 w-5" />,
  website: <AttachmentIcon className="h-5 w-5" />,
};

function SocialLinks({
  socials,
}: {
  socials?: Array<{ name: string; value: string }> | null;
}) {
  const items = socials ?? [];
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item, idx) => {
        const key = String(item?.name ?? "").toLowerCase() as SocialIconName;
        const icon = ICON_MAP[key];
        const href = item?.value || "#";
        if (!icon || href === "#") return null;

        return (
          <a
            key={`${key}-${idx}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${key}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}

function GenerateLinkCTA({
  isAffiliate,
  loading,
  onClick,
  className = "",
}: {
  isAffiliate?: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
}) {
  if (isAffiliate) {
    return (
      <div
        className={[
          "h-12 w-full rounded-xl border border-step-color bg-gradient-green",
          "flex items-center justify-center shadow-green-inset",
          className,
        ].join(" ")}
      >
        <p className="text-[16px] font-semi-normal leading-[19.2px] text-white">
          Link generated
        </p>
      </div>
    );
  }

  return (
    <Button
      className={[
        "h-12 w-full rounded-xl border border-step-color bg-gradient-green",
        "shadow-green-inset hover:shadow-green-inset-strong",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      onClick={onClick}
      disabled={loading}
    >
      <p className="text-[16px] font-semi-normal leading-[19.2px] text-white">
        {loading ? "Generating link..." : "Generate affiliate link"}
      </p>
    </Button>
  );
}

const AgentDetailsClient = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { data: programDetails, isLoading: loading } =
    useAffiliateEventDetailQuery(id);
  const generateAffiliateLinkMutation = useGenerateAffiliateLinkMutation();
  const generateLinkLoading = generateAffiliateLinkMutation.isPending;

  const event = programDetails?.events;

  const toggleModal = () => setIsOpen((p) => !p);

  const generateLink = () => {
    generateAffiliateLinkMutation.mutate(id, {
      onSuccess: () => {
        toggleModal();
        dispatch(
          updateToastifyReducer({
            show: true,
            message:
              "Affiliate link generated successfully. Copy the link below to share with your friends.",
            type: "success",
          }),
        );
      },
      onError: (err: any) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.message ?? "Failed to generate affiliate link",
            type: "error",
          }),
        );
      },
    });
  };

  const startDate = useMemo(
    () => (event?.start_date ? new Date(event.start_date) : null),
    [event],
  );
  const endDate = useMemo(
    () => (event?.end_date ? new Date(event.end_date) : null),
    [event],
  );

  return (
    <MainLayout>
      <section className="bg-white pb-10 laptop:bg-light_grey">
        {/* Header */}
        <div className="border-y border-gray-100 bg-white">
          <div className="mx-auto flex w-full max-w-[1312px] items-center justify-between px-4 py-4 tablet:px-6 laptop:px-10">
            <Link
              href="/event"
              className="inline-flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-gray-50"
            >
              <ChevronLeft />
              <p className="text-[16px] font-semibold tracking-custom">
                Event details
              </p>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-[1312px] px-4 tablet:px-6 laptop:px-10 laptop:pt-4">
          {loading ? (
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-56 w-full rounded-2xl bg-gray-200" />
              </div>
            </div>
          ) : (
            <>
              {/* Top card */}
              <section className="mt-0 laptop:mt-4">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col laptop:flex-row">
                    {/* Image */}
                    <div className="w-full laptop:w-[480px]">
                      <div className="relative aspect-[16/11] w-full bg-gray-100 laptop:aspect-[496/532]">
                        <Image
                          src={
                            event?.event_image || "/images/default-event.jpg"
                          }
                          alt={event?.event_name || "event image"}
                          fill
                          priority={false}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5 tablet:p-7 laptop:p-10">
                      <h1 className="text-[20px] font-semibold leading-snug text-gray-900 tablet:text-[26px] laptop:text-[32px]">
                        {event?.event_name}
                      </h1>

                      {/* Meta */}
                      <div className="mt-5 space-y-3 text-text-grey">
                        <div className="flex items-start gap-3">
                          <CalendarIcon className="mt-[2px]" />
                          <p className="text-[14px] leading-[27px] tablet:text-[16px] laptop:text-[18px]">
                            {startDate
                              ? formatLongDate(startDate, "mid")
                              : "--"}{" "}
                            <span className="mx-1">–</span>
                            {endDate ? formatLongDate(endDate, "mid") : "--"}
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <ClockIcon className="mt-[2px]" />
                          <p className="text-[14px] leading-[27px] tablet:text-[16px] laptop:text-[18px]">
                            {startDate ? formatLongTime(startDate) : "--"}{" "}
                            <span className="mx-1">–</span>
                            {endDate ? formatLongTime(endDate) : "--"}
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <LocationIcon className="mt-[2px]" />
                          <p className="text-[14px] leading-[27px] tablet:text-[16px] laptop:text-[18px]">
                            {event?.location ?? "--"}
                          </p>
                        </div>
                      </div>

                      {/* Contact + CTA (Laptop) */}
                      <div className="mt-10 hidden laptop:block">
                        <p className="text-[18px] font-semibold leading-[27px] tracking-custom text-gray-900">
                          Contact Us
                        </p>
                        <div className="mt-4">
                          <SocialLinks socials={event?.socials} />
                        </div>

                        <div className="mt-8">
                          <GenerateLinkCTA
                            isAffiliate={event?.isAffiliate}
                            loading={generateLinkLoading}
                            onClick={generateLink}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom section */}
              <section className="mt-8 flex flex-col gap-6 laptop:flex-row">
                {/* About */}
                <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm tablet:p-7">
                  <h2 className="text-[20px] font-semibold leading-[33.6px] text-gray-900 tablet:text-[22px]">
                    About Event
                  </h2>

                  <div className="mt-4 text-gray-700">
                    <p className="text-[14px] leading-7 tablet:text-[16px]">
                      {event?.event_description ?? "No description available."}
                    </p>
                  </div>

                  {/* Contact (Mobile/Tablet) */}
                  <div className="mt-8 laptop:hidden">
                    <p className="text-[18px] font-semibold leading-[27px] tracking-custom text-gray-900">
                      Contact Us
                    </p>
                    <div className="mt-4">
                      <SocialLinks socials={event?.socials} />
                    </div>
                  </div>
                </div>

                {/* Tickets */}
                <aside className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm tablet:p-7 laptop:w-[420px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[18px] font-semibold text-gray-900">
                      Tickets
                    </p>
                    {!!event?.isAffiliate && (
                      <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs text-green-700">
                        Affiliate
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    {event?.isAffiliate &&
                    (event?.ticket_sold?.length ?? 0) > 0 ? (
                      event?.ticket_sold?.map((item: any) => (
                        <div
                          key={item?.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50"
                        >
                          <div className="flex flex-col">
                            <p className="text-[14px] font-semi-normal text-gray-900">
                              {item?.name}
                            </p>
                            <p className="text-[12px] font-normal text-text-grey">
                              {item?.count}
                            </p>
                          </div>
                          <p className="text-[14px] font-semi-normal text-gray-900">
                            ₦{formatNumberWithCommas(item?.price)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-600">
                        No ticket sales to display yet.
                      </div>
                    )}
                  </div>

                  {/* CTA (Mobile/Tablet) */}
                  <div className="mt-6 laptop:hidden">
                    <GenerateLinkCTA
                      isAffiliate={event?.isAffiliate}
                      loading={generateLinkLoading}
                      onClick={generateLink}
                    />
                  </div>
                </aside>
              </section>
            </>
          )}
        </div>

        <AffiliateLinkModal
          isOpen={isOpen}
          toggle={toggleModal}
          item={event?.affiliate_link ?? ""}
        />
      </section>
    </MainLayout>
  );
};

export default AgentDetailsClient;
