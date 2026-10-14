"use client";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import StrikeLine from "@/images/icons/strikeLine.svg";
import CopyIcon from "@/images/icons/copyIcon.svg";
import MainLayout from "@/components/layouts/MainLayout";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

import { useAffiliateEventDetailQuery } from "@/features/events/queries";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { getSafeImageSrc } from "@/lib/helper";

interface TicketBreakdown {
  id?: number;
  name?: string;
  price?: number;
  count?: number;
  stock?: number;
  stock_type?: string;
  checkin_count?: number;
}

const ProgramDetailsClient = ({ id }: { id: number }) => {
  const [, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const { push, back } = useNavigation();
  const { data: programDetails } = useAffiliateEventDetailQuery(id);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Copied to clipboard",
          type: "success",
        }),
      );
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t border-b bg-white p-5 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1" onClick={() => back()}>
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Program details</p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:flex-row laptop:justify-between laptop:gap-10 flex flex-col">
            <div className="laptop:w-160 laptop:bg-white w-full gap-6 rounded-xl bg-none">
              <div className="laptop:p-6 p-0">
                <div className="bg-green-tint laptop:w-full flex w-screen items-center gap-3 rounded-lg p-2 px-4">
                  <Image
                    src={getSafeImageSrc(programDetails?.events?.event_image, images.DEFAULT_EVENT)}
                    alt="details"
                    width={120}
                    height={120}
                    className={"h-30 w-30 rounded-xl"}
                  />
                  <div className="flex flex-col">
                    <p className="tracking-custom text-body-xl font-sans font-semibold">
                      {programDetails?.events?.event_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="tracking-custom text-text-grey text-body-l font-sans leading-6.75 font-normal">
                        {formatLongDate(programDetails?.events?.start_date, "mid")}
                      </p>
                      <DotIcon className="w-1" />
                      <p className="tracking-custom text-text-grey text-body-l font-sans leading-6.75 font-normal">
                        {formatTime(programDetails?.events?.start_date ?? null)}
                      </p>
                      <p className="text-text-grey font-sans">-</p>
                      <p className="tracking-custom text-text-grey text-body-l font-sans leading-6.75 font-normal">
                        {formatTime(programDetails?.events?.end_date ?? null)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <p className="text-text-grey text-body-l font-sans leading-6.75 font-normal">
                        {programDetails?.events?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-light-tint mt-6 mb-7 gap-4 rounded-xl p-4">
                  {programDetails?.events?.isAffiliate ? (
                    <>
                      <p className="font-semi-normal text-text-grey text-body-s">Affiliate link</p>
                      <div className="bg-light-tint-3 mt-2 flex items-center gap-2 rounded-xl p-3">
                        <p className="font-semi-normal text-light-black laptop:w-125 w-62.75 truncate">
                          {process.env.NEXT_PUBLIC_APP_URL +
                            "/" +
                            programDetails?.events?.affiliate_link || "No affiliate link"}
                        </p>
                        <StrikeLine />
                        <CopyIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() =>
                            handleCopy(
                              `${process.env.NEXT_PUBLIC_APP_URL + "/" + programDetails?.events?.affiliate_link}`,
                            )
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div
                      className={
                        "bg-gradient-green hover:bg-mid-green flex h-12 cursor-pointer items-center justify-center rounded-xl"
                      }
                      onClick={() => push(routes.EVENT_AGENT_DETAILS(id))}
                    >
                      <p className={"font-medium text-white"}>Generate payment link</p>
                    </div>
                  )}
                </div>
                <div className="border-mid-grey laptop:bg-none laptop:shadow-none flex flex-col rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-text-grey text-body-s font-sans font-normal">
                    Total commission
                  </p>
                  <p className="tracking-custom text-body-xl font-sans font-semibold">
                    ₦{" "}
                    {formatNumberWithCommas(
                      programDetails?.events?.breakdown?.total_commissions ?? 0,
                    )}
                  </p>
                  <div className="border-t-mid-grey my-4 border-t"></div>
                  <p className="text-text-grey text-body-s font-sans font-normal">Tickets sold</p>
                  <p className="tracking-custom text-body-xl font-sans font-semibold">
                    {programDetails?.events?.breakdown?.ticket_sold || 0}
                  </p>
                </div>
              </div>
            </div>

            {programDetails?.events?.isAffiliate && (
              <div className="laptop:w-120 laptop:bg-white flex w-full flex-col gap-4 rounded-lg bg-none p-4">
                <div className="laptop:bg-none rounded-lg bg-white p-4">
                  <p className="tracking-custom text-body-l font-sans font-semibold">
                    Commissions by ticket type
                  </p>
                  {(programDetails?.events?.commissions?.length ?? 0) > 0 &&
                    (programDetails?.events?.commissions as TicketBreakdown[] | undefined)?.map(
                      (commission, index: number) => {
                        const totalStock = Number(commission?.stock) || 0;
                        const checkinCount = Number(commission?.checkin_count) || 0;

                        const progressWidth =
                          commission?.stock_type === "unlimited"
                            ? "100%"
                            : totalStock > 0
                              ? `${Math.min((checkinCount / totalStock) * 100, 100)}%`
                              : "0%";

                        return (
                          <div key={commission?.id ?? index}>
                            <p className="text-label mt-4 font-sans font-normal">
                              {commission?.name}
                            </p>
                            <div className="mt-0.5 flex justify-between">
                              <p className="tracking-custom text-body-xl font-sans font-semibold">
                                N{formatNumberWithCommas(commission?.price)}
                              </p>
                              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                                {commission?.count}/
                                {commission.stock_type === "unlimited" ? "∞" : commission.stock}
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
                      },
                    )}
                </div>
                <div className="laptop:bg-none rounded-lg bg-white p-4">
                  <p className="tracking-custom text-body-l font-sans font-semibold">
                    Tickets sold by ticket type
                  </p>

                  {(programDetails?.events?.ticket_sold?.length ?? 0) > 0 &&
                    (programDetails?.events?.ticket_sold as TicketBreakdown[] | undefined)?.map(
                      (ticket, index: number) => {
                        const totalStock = Number(ticket?.stock) || 0;
                        const checkinCount = Number(ticket?.checkin_count) || 0;

                        const progressWidth =
                          ticket?.stock_type === "unlimited"
                            ? "100%"
                            : totalStock > 0
                              ? `${Math.min((checkinCount / totalStock) * 100, 100)}%`
                              : "0%";

                        const percentageText =
                          ticket?.stock_type === "unlimited"
                            ? "100%"
                            : totalStock > 0
                              ? `${Math.min((checkinCount / totalStock) * 100, 100).toFixed(0)}%`
                              : "0%";

                        return (
                          <div key={ticket?.id ?? index}>
                            <p className="text-label mt-4 font-sans font-normal">{ticket.name}</p>
                            <div className="mt-0.5 flex justify-between">
                              <p className="tracking-custom text-body-xl font-sans font-semibold">
                                {percentageText}
                              </p>
                              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                                {ticket?.count}/
                                {ticket.stock_type === "unlimited" ? "∞" : ticket.stock}
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
                      },
                    )}
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default ProgramDetailsClient;
