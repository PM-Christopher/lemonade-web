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

const ProgramDetailsPage = ({ params }: { params: { id: number } }) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: programDetails, isLoading: loading } = useAffiliateEventDetailQuery(params.id);

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
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-5 px-10">
          <div
            className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Program details</p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="flex flex-col laptop:flex-row laptop:justify-between laptop:gap-[40px]">
            <div className="w-full gap-[24px] rounded-[12px] bg-none laptop:w-[640px] laptop:bg-white">
              <div className="p-0 laptop:p-[24px]">
                <div className="flex w-screen items-center gap-3 rounded-[8px] bg-green-tint p-[8px] px-[16px] laptop:w-full">
                  <Image
                    src={programDetails?.events?.event_image || "/images/default-event.jpg"}
                    alt="details"
                    width={120}
                    height={120}
                    className={"h-[120px] w-[120px] rounded-[12px]"}
                  />
                  <div className="flex flex-col">
                    <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                      {programDetails?.events?.event_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                        {formatLongDate(programDetails?.events?.start_date, "mid")}
                      </p>
                      <DotIcon className="w-1" />
                      <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                        {formatTime(programDetails?.events?.start_date ?? null)}
                      </p>
                      <p className="font-sans text-text-grey">-</p>
                      <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                        {formatTime(programDetails?.events?.end_date ?? null)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <p className="font-sans text-[16px] font-normal leading-[27px] text-text-grey">
                        {programDetails?.events?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-[24px]">
                <div className="mb-[28px] mt-[24px] gap-[16px] rounded-[12px] bg-light-tint p-[16px]">
                  {programDetails?.events?.isAffiliate ? (
                    <>
                      <p className="text-[14px] font-semi-normal text-text-grey">Affiliate link</p>
                      <div className="mt-[8px] flex items-center gap-[8px] rounded-[12px] bg-light-tint-3 p-[12px]">
                        <p className="w-[251px] truncate font-semi-normal text-light-black laptop:w-[500px]">
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
                        "flex h-[48px] cursor-pointer items-center justify-center rounded-[12px] bg-gradient-green hover:bg-mid-green"
                      }
                      onClick={() => router.push(`/event/${params.id}/agent-details`)}
                    >
                      <p className={"font-medium text-white"}>Generate payment link</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col rounded-[12px] border-[1px] border-mid-grey bg-white p-[16px] shadow-sm laptop:bg-none laptop:shadow-none">
                  <p className="font-sans text-[14px] font-normal text-text-grey">
                    Total commission
                  </p>
                  <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                    ₦{" "}
                    {formatNumberWithCommas(
                      programDetails?.events?.breakdown?.total_commissions ?? 0,
                    )}
                  </p>
                  <div className="my-[16px] border-t-[1px] border-t-mid-grey"></div>
                  <p className="font-sans text-[14px] font-normal text-text-grey">Tickets sold</p>
                  <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                    {programDetails?.events?.breakdown?.ticket_sold || 0}
                  </p>
                </div>
              </div>
            </div>

            {programDetails?.events?.isAffiliate && (
              <div className="flex w-full flex-col gap-4 rounded-[8px] bg-none p-[16px] laptop:w-[480px] laptop:bg-white">
                <div className="rounded-[8px] bg-white p-[16px] laptop:bg-none">
                  <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
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
                          <p className="mt-[16px] font-sans text-[14px] font-normal leading-[16.8px]">
                            {commission?.name}
                          </p>
                          <div className="mt-[2px] flex justify-between">
                            <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                              N{formatNumberWithCommas(commission?.price)}
                            </p>
                            <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
                              {commission?.count}/
                              {commission.stock_type === "unlimited" ? "∞" : commission.stock}
                            </p>
                          </div>
                          <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200">
                            <div
                              className="h-[8px] rounded-full bg-gradient-progress-green"
                              style={{ width: progressWidth }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="rounded-[8px] bg-white p-[16px] laptop:bg-none">
                  <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
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
                          <p className="mt-[16px] font-sans text-[14px] font-normal leading-[16.8px]">
                            {ticket.name}
                          </p>
                          <div className="mt-[2px] flex justify-between">
                            <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                              {percentageText}
                            </p>
                            <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
                              {ticket?.count}/
                              {ticket.stock_type === "unlimited" ? "∞" : ticket.stock}
                            </p>
                          </div>
                          <div className="mt-[4px] h-[8px] w-full rounded-full bg-gray-200">
                            <div
                              className="h-[8px] rounded-full bg-gradient-progress-green"
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

export default ProgramDetailsPage;
