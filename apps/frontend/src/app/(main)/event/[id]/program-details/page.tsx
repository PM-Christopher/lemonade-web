"use client";
import React, {useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import StrikeLine from "@/images/icons/strikeLine.svg";
import CopyIcon from "@/images/icons/copyIcon.svg";
import MainLayout from "@/components/layouts/MainLayout";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useRouter} from "next/navigation";
import {useAffiliateEventDetailQuery} from "@/features/events/queries";
import {formatLongDate, formatTime} from "@/lib/dateTimeFormatter";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {FaNairaSign} from "react-icons/fa6";

const ProgramDetailsPage = ({params}: { params: { id: number } }) => {
    const [copied, setCopied] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter()
    const {data: programDetails, isLoading: loading} = useAffiliateEventDetailQuery(params.id)

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Copied to clipboard",
                    type: "success",
                })
            );
            setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
        });
    };

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Program details
                        </p>
                    </div>
                </div>

                <section className="mt-4 flex flex-col items-center">
                    <div className="flex flex-col laptop:flex-row laptop:justify-between laptop:gap-[40px]">
                        <div className="w-full laptop:w-[640px] rounded-[12px] gap-[24px] bg-none laptop:bg-white">
                            <div className="p-0 laptop:p-[24px]">
                                <div
                                    className="w-screen laptop:w-full bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                                    <Image
                                        src={programDetails?.events?.event_image || "/images/default-event.jpg"}
                                        alt="details"
                                        width={120}
                                        height={120}
                                        className={"w-[120px] h-[120px] rounded-[12px]"}
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                            {programDetails?.events?.event_name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon/>
                                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                                                {formatLongDate(programDetails?.events?.start_date, "mid")}

                                            </p>
                                            <DotIcon className="w-1"/>
                                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                                                {formatTime(programDetails?.events?.start_date ?? null)}
                                            </p>
                                            <p className="font-sans text-text-grey">-</p>
                                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                                                {formatTime(programDetails?.events?.end_date ?? null)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LocationIcon/>
                                            <p className="font-sans font-normal text-[16px] leading-[27px] text-text-grey">
                                                {programDetails?.events?.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-[24px]">
                                <div className="p-[16px] rounded-[12px] gap-[16px] bg-light-tint mt-[24px] mb-[28px]">
                                    {
                                        programDetails?.events?.isAffiliate ? (
                                            <>
                                                <p className="font-semi-normal text-text-grey text-[14px]">
                                                    Affiliate link
                                                </p>
                                                <div
                                                    className="p-[12px] rounded-[12px] gap-[8px] bg-light-tint-3 mt-[8px] flex items-center">
                                                    <p className="w-[251px] laptop:w-[500px] font-semi-normal text-light-black truncate">
                                                        {
                                                            process.env.NEXT_PUBLIC_APP_URL + "/" + programDetails?.events?.affiliate_link || "No affiliate link"
                                                        }
                                                    </p>
                                                    <StrikeLine/>
                                                    <CopyIcon
                                                        className="w-[20px] h-[20px] cursor-pointer"
                                                        onClick={() =>
                                                            handleCopy(
                                                                `${process.env.NEXT_PUBLIC_APP_URL + "/" + programDetails?.events?.affiliate_link}`
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                className={"bg-gradient-green h-[48px] rounded-[12px] cursor-pointer flex items-center justify-center hover:bg-mid-green"}
                                                onClick={() => router.push(`/event/${params.id}/agent-details`)}
                                            >
                                                <p className={'text-white font-medium'}>Generate payment link</p>
                                            </div>
                                        )
                                    }
                                </div>
                                <div
                                    className="flex flex-col p-[16px] rounded-[12px] border-[1px] border-mid-grey bg-white laptop:bg-none shadow-sm laptop:shadow-none">
                                    <p className="font-sans font-normal text-text-grey text-[14px]">
                                        Total commission
                                    </p>
                                    <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                        ₦ {formatNumberWithCommas(programDetails?.events?.breakdown?.total_commissions ?? 0)}
                                    </p>
                                    <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                    <p className="font-sans font-normal text-text-grey text-[14px]">
                                        Tickets sold
                                    </p>
                                    <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                        {programDetails?.events?.breakdown?.ticket_sold || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {
                            programDetails?.events?.isAffiliate && (
                                <div
                                    className="w-full laptop:w-[480px] bg-none laptop:bg-white p-[16px] rounded-[8px] flex flex-col gap-4">
                                    <div className="bg-white laptop:bg-none p-[16px] rounded-[8px]">
                                        <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                            Commissions by ticket type
                                        </p>
                                        {
                                            (programDetails?.events?.commissions?.length ?? 0) > 0 && programDetails?.events?.commissions?.map((commission: any, index: number) => {
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
                                                        <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                                            {commission?.name}
                                                        </p>
                                                        <div className="flex justify-between mt-[2px]">
                                                            <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                                                N{formatNumberWithCommas(commission?.price)}
                                                            </p>
                                                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                                                {commission?.count}/{commission.stock_type === 'unlimited' ? "∞" : commission.stock}
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
                                        }

                                    </div>
                                    <div className="bg-white laptop:bg-none p-[16px] rounded-[8px]">
                                        <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                            Tickets sold by ticket type
                                        </p>

                                        {
                                            (programDetails?.events?.ticket_sold?.length ?? 0) > 0 && programDetails?.events?.ticket_sold?.map((ticket: any, index: number) => {
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
                                                        <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                                            {ticket.name}
                                                        </p>
                                                        <div className="flex justify-between mt-[2px]">
                                                            <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                                                {percentageText}
                                                            </p>
                                                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                                                {ticket?.count}/{ticket.stock_type === 'unlimited' ? "∞" : ticket.stock}
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
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </section>
            </section>
        </MainLayout>
    );
};

export default ProgramDetailsPage;
