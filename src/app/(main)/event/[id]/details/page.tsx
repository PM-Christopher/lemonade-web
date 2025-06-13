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
import PaymentSuccessfulModal from "@/components/events/Modals/PaymentSuccessfulModal";
import PromotionDetailsModal from "@/components/events/Modals/PromotionDetailsModal";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {getEvent} from "@/features/events/event.slice";
import {formatNumberWithCommas} from "@/lib/formatNumber";

const EventDetailsPage = ({params}: {params: {id: number}}) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { event, loading: dataLoading } = useSelector((state:any) => state.event)

  const {authToken} = useSelector((state: any) => state.auth)
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  console.log({event})
  const router = useRouter();

  const activateModal = () => {
    setIsOpen(!isOpen);
  };

  const activateDetailsModal = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  useEffect(() => {
    if (authToken && params?.id) {
      dispatch(getEvent({token: authToken, id: params.id}))
    }
  }, []);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Event details
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <div className="flex justify-between gap-[24px]">
            <div>
              <div className="w-[640px] p-[24px] rounded-[12px] bg-white flex flex-col">
                <div className="bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                  <Image
                    src={event?.event?.event_image}
                    alt="details"
                    width={120}
                    height={120}
                    className={"w-[120px] h-[120px]"}
                  />
                  <div className="flex flex-col">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      {event?.event?.event_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        Mon, 23 Mar
                      </p>
                      <DotIcon className="w-1" />
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        4PM
                      </p>
                      <p className="font-sans text-text-grey">-</p>
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        6PM
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <p className="font-sans font-normal text-[16px] leading-[27px] text-text-grey">
                        {event?.event?.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center mt-[24px] gap-8">
                  <Link href={"/event/5/promote-event"}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                        <MicIcon />
                      </div>
                      <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                        Promote
                      </p>
                    </div>
                  </Link>
                  <Link href={"/"}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                        <QrIcon />
                      </div>
                      <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                        Check in
                      </p>
                    </div>
                  </Link>
                  <Link href={"/"}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                        <EditIcon />
                      </div>
                      <div>
                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                          Edit event
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link href={"/"}>
                    <div className="flex flex-col items-center gap-[8px]">
                      <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                        <TicketIcon />
                      </div>
                      <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">
                        Add ticket
                      </p>
                    </div>
                  </Link>
                </div>
                <Link href={"/event/5/guest-list"}>
                  <div className="flex justify-between items-center p-[12px] px-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                    <div className="flex items-center gap-2">
                      <AffiliateUsersIcon />
                      <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom">
                        Guest list
                      </p>
                    </div>
                    <ChevronRightIcon />
                  </div>
                </Link>
                <div className="flex flex-col p-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                  <div className="flex flex-col">
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                      Sales Revenue
                    </p>
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                      ₦{event?.event?.breakdown?.sales_revenue}
                    </p>
                  </div>
                  <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                  <div className="flex flex-col">
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                      Tickets sold
                    </p>
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                      {event?.event?.breakdown?.tickets_sold?.sold}/{event?.event?.breakdown?.tickets_sold?.count}
                    </p>
                  </div>
                  <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                  <div className="flex flex-col">
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                      Check ins
                    </p>
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">
                      {event?.event?.breakdown?.checkins?.percentage}% <span className="font-normal">({event?.event?.breakdown?.checkins?.count}/{event?.event?.breakdown?.checkins?.total})</span>
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
                  event?.event?.sales_revenue?.sales_revenue_breakdown?.length > 0 && (
                      event?.event?.sales_revenue?.sales_revenue_breakdown?.map((ticket: any, idx: number) => (
                          <div>
                            <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                              {ticket?.name}
                            </p>
                            <div className="flex justify-between mt-[2px]">
                              <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                ₦{formatNumberWithCommas(ticket?.price)}
                              </p>
                              <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                {ticket?.bought}/{ticket?.stock}
                              </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                              <div
                                  className="bg-gradient-progress-green h-[8px] rounded-full"
                                  style={{ width: `${(ticket?.bought / ticket?.stock) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                      ))
                    )
                }

              </div>
              <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                  Ticket sold by ticket type
                </p>

                {
                    event?.event?.sales_revenue?.tickets_sold_breakdown?.length > 0 && (
                        event?.event?.sales_revenue?.tickets_sold_breakdown?.map((ticket: any, idx: number) => (
                            <div>
                              <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                {ticket?.name}
                              </p>
                              <div className="flex justify-between mt-[2px]">
                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                  {ticket?.percentage_sold}%
                                </p>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                  {ticket?.bought}/{ticket?.stock}
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                <div
                                    className="bg-gradient-progress-green h-[8px] rounded-full"
                                    style={{ width: `${ticket?.percentage_sold}%` }}
                                ></div>
                              </div>
                            </div>
                            ))
                    )
                }




              </div>
              <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                  Check ins by ticket type
                </p>
                {
                    event?.event?.sales_revenue?.tickets_checkins_breakdown?.length > 0 && (
                        event?.event?.sales_revenue?.tickets_checkins_breakdown?.map((ticket: any, idx: number) => (
                            <div>
                              <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                                {ticket?.name}
                              </p>
                              <div className="flex justify-between mt-[2px]">
                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                                  {`${(ticket?.checkin_count / ticket?.stock) * 100}%`}
                                </p>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                  {ticket?.checkin_count}/{ticket?.stock}
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                <div
                                    className="bg-gradient-progress-green h-[8px] rounded-full"
                                    style={{ width: `${(ticket?.checkin_count / ticket?.stock) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            )
                        )
                    )
                }

              </div>
            </div>
          </div>
        </div>
        <PaymentSuccessfulModal toggle={activateModal} isOpen={isOpen} />
        <PromotionDetailsModal
          toggle={activateDetailsModal}
          isOpen={isDetailsOpen}
        />
      </section>
    </MainLayout>
  );
};

export default EventDetailsPage;
