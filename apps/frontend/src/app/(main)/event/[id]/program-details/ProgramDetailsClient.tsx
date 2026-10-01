"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
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
import { useRouter } from "next/navigation";
import { useAffiliateEventDetailQuery } from "@/features/events/queries";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { FaNairaSign } from "react-icons/fa6";
import { getSafeImageSrc } from "@/lib/helper";

const ProgramDetailsClient = ({ id }: { id: number }) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: programDetails, isLoading: loading } = useAffiliateEventDetailQuery(id);

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
        <div className="flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-5 px-10">
          <div
            className="flex items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Program details</p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:flex-row laptop:justify-between laptop:gap-[40px] flex flex-col">
            <div className="laptop:w-[640px] laptop:bg-white w-full gap-[24px] rounded-[12px] bg-none">
              <div className="laptop:p-[24px] p-0">
                <div className="bg-green-tint laptop:w-full flex w-screen items-center gap-3 rounded-[8px] p-[8px] px-[16px]">
                  <Image
                    src={getSafeImageSrc(
                      programDetails?.events?.event_image,
                      "/images/default-event.jpg",
                    )}
                    alt="details"
                    width={120}
                    height={120}
                    className={"h-[120px] w-[120px] rounded-[12px]"}
                  />
                  <div className="flex flex-col">
                    <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                      {programDetails?.events?.event_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                        {formatLongDate(programDetails?.events?.start_date, "mid")}
                      </p>
                      <DotIcon className="w-1" />
                      <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                        {formatTime(programDetails?.events?.start_date ?? null)}
                      </p>
                      <p className="text-text-grey font-sans">-</p>
                      <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                        {formatTime(programDetails?.events?.end_date ?? null)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <p className="text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                        {programDetails?.events?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-[24px]">
                <div className="bg-light-tint mt-[24px] mb-[28px] gap-[16px] rounded-[12px] p-[16px]">
                  {programDetails?.events?.isAffiliate ? (
                    <>
                      <p className="font-semi-normal text-text-grey text-[14px]">Affiliate link</p>
                      <div className="bg-light-tint-3 mt-[8px] flex items-center gap-[8px] rounded-[12px] p-[12px]">
                        <p className="font-semi-normal text-light-black laptop:w-[500px] w-[251px] truncate">
                          {process.env.NEXT_PUBLIC_APP_URL +
                            "/" +
                            programDetails?.events?.affiliate_link || "No affiliate link"}
                        </p>
                        <StrikeLine />
                        <CopyIcon
                          className="h-[20px] w-[20px] cursor-pointer"
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
                        "bg-gradient-green hover:bg-mid-green flex h-[48px] cursor-pointer items-center justify-center rounded-[12px]"
                      }
                      onClick={() => router.push(`/event/${id}/agent-details`)}
                    >
                      <p className={"font-medium text-white"}>Generate payment link</p>
                    </div>
                  )}
                </div>
                <div className="border-mid-grey laptop:bg-none laptop:shadow-none flex flex-col rounded-[12px] border-[1px] bg-white p-[16px] shadow-sm">
                  <p className="text-text-grey font-sans text-[14px] font-normal">
                    Total commission
                  </p>
                  <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                    ₦{" "}
                    {formatNumberWithCommas(
                      programDetails?.events?.breakdown?.total_commissions ?? 0,
                    )}
                  </p>
                  <div className="border-t-mid-grey my-[16px] border-t-[1px]"></div>
                  <p className="text-text-grey font-sans text-[14px] font-normal">Tickets sold</p>
                  <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                    {programDetails?.events?.breakdown?.ticket_sold || 0}
                  </p>
                </div>
              </div>
            </div>

            {programDetails?.events?.isAffiliate && (
              <div className="laptop:w-[480px] laptop:bg-white flex w-full flex-col gap-4 rounded-[8px] bg-none p-[16px]">
                <div className="laptop:bg-none rounded-[8px] bg-white p-[16px]">
                  <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                    Commissions by ticket type
                  </p>
                  {(programDetails?.events?.commissions?.length ?? 0) > 0 &&
                    programDetails?.events?.commissions?.map((commission: any, index: number) => {
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
                          <p className="mt-[16px] font-sans text-[14px] leading-[16.8px] font-normal">
                            {commission?.name}
                          </p>
                          <div className="mt-[2px] flex justify-between">
                            <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                              N{formatNumberWithCommas(commission?.price)}
                            </p>
                            <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                              {commission?.count}/
                              {commission.stock_type === "unlimited" ? "∞" : commission.stock}
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
                    })}
                </div>
                <div className="laptop:bg-none rounded-[8px] bg-white p-[16px]">
                  <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                    Tickets sold by ticket type
                  </p>

                  {(programDetails?.events?.ticket_sold?.length ?? 0) > 0 &&
                    programDetails?.events?.ticket_sold?.map((ticket: any, index: number) => {
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
                          <p className="mt-[16px] font-sans text-[14px] leading-[16.8px] font-normal">
                            {ticket.name}
                          </p>
                          <div className="mt-[2px] flex justify-between">
                            <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                              {percentageText}
                            </p>
                            <p className="font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                              {ticket?.count}/
                              {ticket.stock_type === "unlimited" ? "∞" : ticket.stock}
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
                    })}
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
