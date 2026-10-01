"use client";
import React, { useMemo, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import { Button } from "@lemonade/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { TicketDetails, TicketInterface } from "@/interfaces/EventInterface";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { addTickets } from "@/features/events/event.slice";
import { useEventTicketDataQuery } from "@/features/events/queries";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronUp } from "lucide-react";
import TicketSummary from "@/components/events/Modals/TicketSummary";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { EventTicketDetailSkeleton } from "@/components/Skeletons";
import { getSafeImageSrc } from "@/lib/helper";

const BuyTicketClient = ({ id }: { id: number }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [summaryModal, setSummaryModal] = useState(false);
  const { data: ticket_data, isLoading: loading } = useEventTicketDataQuery(id);
  const { event, tickets } = ticket_data || {};
  const searchParams = useSearchParams();

  const initialQuantities = useMemo(() => {
    if (!tickets) return [];
    return tickets.map((ticket: TicketInterface) => ({
      id: ticket.id,
      ticket_name: ticket.name,
      ticket_description: ticket.description,
      quantity: 0,
      price: ticket.price,
      purchase_limit: ticket.purchase_limit,
    }));
  }, [tickets]);
  const [quantities, setQuantities] = useState<TicketDetails[]>(initialQuantities);
  const [seenTickets, setSeenTickets] = useState(tickets);
  if (tickets !== seenTickets) {
    setSeenTickets(tickets);
    setQuantities(initialQuantities);
  }

  const handleIncrement = (index: number) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((ticketDetail, i) => {
        if (i == index) {
          // Only increment if the quantity is less than purchase_limit
          if (ticketDetail.quantity < ticketDetail.purchase_limit) {
            return { ...ticketDetail, quantity: ticketDetail.quantity + 1 };
          }
        }
        return ticketDetail;
      }),
    );
  };

  const handleDecrement = (index: number) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((ticketDetail, i) =>
        i === index && ticketDetail.quantity > 0
          ? { ...ticketDetail, quantity: ticketDetail.quantity - 1 }
          : ticketDetail,
      ),
    );
  };

  const calculateSubtotal = () => {
    return quantities.reduce((total, ticket) => {
      return total + ticket.quantity * ticket.price;
    }, 0);
  };

  const totalAmount = () => {
    return calculateSubtotal();
  };

  const hasValidQuantity = (tickets: any[]): boolean => {
    return tickets.some((ticket) => ticket.quantity > 0);
  };

  const referralFromUrl = searchParams.get("referral");
  const buyTicketHref = referralFromUrl
    ? `/event/${id}/assign-ticket?referral=${encodeURIComponent(referralFromUrl)}`
    : `/event/${id}/assign-ticket`;

  const proceed = () => {
    const validTickets = quantities.filter((ticket) => ticket.quantity > 0);

    const data = {
      tickets: validTickets,
      total: totalAmount(),
    };
    if (!hasValidQuantity(data.tickets)) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please select at least one ticket quantity before proceeding.",
          type: "error",
        }),
      );
      return;
    }
    dispatch(addTickets(data));
    router.push(buyTicketHref);
  };

  const toggleSummaryModal = () => {
    setSummaryModal(!summaryModal);
  };

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[12px] px-10">
          <div
            className="flex items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Buy ticket</p>
          </div>
        </div>
        <section className="laptop:bg-none mt-4 bg-white">
          <div className="laptop:flex-row laptop:justify-around flex flex-col">
            <div className="laptop:w-[688px] laptop:bg-white laptop:p-[24px] flex w-full flex-col justify-between gap-y-[460px] rounded-[12px] bg-none p-0 py-[10px]">
              {loading ? (
                <EventTicketDetailSkeleton />
              ) : (
                <div className="">
                  <div className="bg-green-tint laptop:flex-row laptop:p-6 flex flex-col gap-4 rounded-xl p-4 transition-shadow duration-300 hover:shadow-lg">
                    {/* Event Poster */}
                    <div className="laptop:h-[120px] laptop:w-[120px] h-[120px] w-full flex-shrink-0">
                      <Image
                        src={getSafeImageSrc(event?.event_image, "/images/default-event.jpg")}
                        alt={event?.event_name || "event poster"}
                        width={120}
                        height={120}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="text-black-light laptop:text-[18px] font-sans text-[16px] leading-[28px] font-semibold">
                        {event?.event_name}
                      </p>

                      {/* Date */}
                      <div className="text-text-grey laptop:text-[16px] flex items-center gap-2 text-[14px]">
                        <CalendarIcon className="text-gray-500" />
                        <span>{formatLongDate(event?.start_date, "mid")}</span>
                        <span>-</span>
                        <span>{formatLongDate(event?.end_date, "mid")}</span>
                      </div>

                      {/* Time */}
                      <div className="text-text-grey laptop:text-[16px] flex items-center gap-2 text-[14px]">
                        <ClockIcon className="text-gray-500" />
                        <span>{formatTime(event?.start_date ?? null)}</span>
                        <span>-</span>
                        <span>{formatTime(event?.end_date ?? null)}</span>
                      </div>
                    </div>
                  </div>

                  {tickets?.map((ticket: TicketInterface, index: number) => (
                    <div className="laptop:none px-[16px]" key={index}>
                      <div className="mt-[24px] flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="font-semi-normal text-black-light font-sans text-[14px] leading-[21px]">
                            {ticket.name}
                          </p>
                          <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                            {ticket?.price === 0 ? "Free" : `₦ ${ticket?.price}`}
                          </p>
                          <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="bg-light-white flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[8px] p-3"
                            onClick={() => handleDecrement(index)}
                          >
                            <p className="">-</p>
                          </div>
                          <div className="bg-light-white flex h-[28px] w-[27.75px] items-center justify-center rounded-[8px] p-4">
                            <p className="font-semi-normal tracking-custom font-sans text-[16px] leading-[24px]">
                              {quantities[index]?.quantity}
                            </p>
                          </div>
                          <div
                            className="bg-light-white flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[8px] p-3"
                            onClick={() => handleIncrement(index)}
                          >
                            <p className="">+</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-grey-20 my-2 border-t-[1px]"></div>
                    </div>
                  ))}
                </div>
              )}
              <div className="laptop:hidden flex items-center justify-center gap-[16px]">
                <div className="flex w-[147px] items-center gap-[16px]">
                  <p className="text-mid-green text-[20px] font-bold">
                    {totalAmount() === 0 ? (
                      <>₦ {totalAmount()}</>
                    ) : (
                      <>₦ {formatNumberWithCommas(totalAmount())}</>
                    )}
                  </p>
                  <ChevronUp
                    className="text-mid-green cursor-pointer"
                    onClick={toggleSummaryModal}
                  />
                </div>
                <Button
                  className="bg-gradient-green h-[48px] w-[180px] rounded-[12px] border-b-[2px] px-[48px] py-[14px] shadow-none"
                  onClick={proceed}
                >
                  <p className="font-semi-normal text-[16px]">Assign ticket</p>
                </Button>
              </div>
            </div>
            <div className="laptop:block hidden">
              <div className="w-[480px] rounded-[12px] bg-white px-[10px] py-[12px]">
                <p className="font-sans text-[20px] leading-[28px] font-semibold">Summary</p>
                {quantities?.map(
                  (quantity: TicketDetails, index: number) =>
                    quantity.quantity > 0 && (
                      <div className="mt-[16px] flex justify-between" key={index}>
                        <div>
                          <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                            {quantity.quantity} {quantity.ticket_name}
                          </p>
                        </div>
                        <div>
                          <p className="tracking-custom text-light-black font-sans text-[14px] leading-[21px] font-semibold">
                            {quantity.price * quantity.quantity === 0 ? (
                              <>₦ {quantity.price * quantity.quantity}</>
                            ) : (
                              <>₦ {formatNumberWithCommas(quantity.price * quantity.quantity)}</>
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                )}
                <div className="border-grey-20 my-4 border-t-[1px]"></div>
                <div className="mt-[16px] flex justify-between">
                  <div>
                    <p className="tracking-custom text-text-grey font-sans text-[14px] leading-[21px] font-normal">
                      Subtotal
                    </p>
                  </div>
                  <div>
                    <p className="tracking-custom text-light-black font-sans text-[14px] leading-[21px] font-semibold">
                      {calculateSubtotal() === 0 ? (
                        <>₦ {calculateSubtotal()}</>
                      ) : (
                        <>₦ {formatNumberWithCommas(calculateSubtotal())}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-grey-20 my-4 border-t-[1px]"></div>
                <div className="mt-[16px] flex justify-between">
                  <div>
                    <p className="tracking-custom text-text-grey font-sans text-[18px] leading-[27px] font-normal">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="tracking-custom text-light-black font-sans text-[18px] leading-[27px] font-semibold">
                      {totalAmount() === 0 ? (
                        <>₦ {totalAmount()}</>
                      ) : (
                        <>₦ {formatNumberWithCommas(totalAmount())}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-[20px] flex items-center justify-between">
                  <div>
                    <p className="tracking-custom text-text-grey pl-[40px] font-sans text-[18px] leading-[27px] font-normal">
                      -
                    </p>
                  </div>
                  <div>
                    <Button
                      className={
                        "bg-gradient-green shadow-custom-bottom h-[48px] w-[216px] gap-[8px] rounded-[12px] border-b-2 border-transparent px-[48px] py-[14px]"
                      }
                      onClick={proceed}
                    >
                      <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">
                        Assign ticket
                      </p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <TicketSummary
        quantities={quantities}
        isOpen={summaryModal}
        toggle={toggleSummaryModal}
        total={totalAmount()}
        subtotal={calculateSubtotal()}
        proceed={proceed}
      />
    </MainLayout>
  );
};

export default BuyTicketClient;
