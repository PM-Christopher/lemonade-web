"use client";
import React, { useState, useEffect, use } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import { Button } from "@/components/ui/button";
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

const Page = (props: { params: Promise<{ id: number }> }) => {
  const params = use(props.params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [summaryModal, setSummaryModal] = useState(false);
  const { data: ticket_data, isLoading: loading } = useEventTicketDataQuery(params.id);
  const { event, tickets } = ticket_data || {};
  const searchParams = useSearchParams();

  const [quantities, setQuantities] = useState<TicketDetails[]>([]);

  useEffect(() => {
    if (tickets) {
      const initialQuantities = tickets.map((ticket: TicketInterface) => ({
        id: ticket.id,
        ticket_name: ticket.name,
        ticket_description: ticket.description,
        quantity: 0,
        price: ticket.price,
        purchase_limit: ticket.purchase_limit,
      }));
      setQuantities(initialQuantities);
    }
  }, [tickets]);

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
    ? `/event/${params.id}/assign-ticket?referral=${encodeURIComponent(referralFromUrl)}`
    : `/event/${params.id}/assign-ticket`;

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
    // router.push(`/event/${params.id}/assign-ticket`);
    router.push(buyTicketHref);
  };

  const toggleSummaryModal = () => {
    setSummaryModal(!summaryModal);
  };

  return (
    <MainLayout>
      <section className="bg-white pb-10 laptop:bg-light_grey">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[12px] px-10">
          <div
            className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Buy ticket</p>
          </div>
        </div>
        <section className="mt-4 bg-white laptop:bg-none">
          <div className="flex flex-col laptop:flex-row laptop:justify-around">
            <div className="flex w-full flex-col justify-between gap-y-[460px] rounded-[12px] bg-none p-0 py-[10px] laptop:w-[688px] laptop:bg-white laptop:p-[24px]">
              {loading ? (
                <EventTicketDetailSkeleton />
              ) : (
                <div className="">
                  <div className="flex flex-col gap-4 rounded-xl bg-green-tint p-4 transition-shadow duration-300 hover:shadow-lg laptop:flex-row laptop:p-6">
                    {/* Event Poster */}
                    <div className="h-[120px] w-full flex-shrink-0 laptop:h-[120px] laptop:w-[120px]">
                      <Image
                        src={event?.event_image || "/images/default-event.jpg"}
                        alt={event?.event_name || "event poster"}
                        width={120}
                        height={120}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="font-sans text-[16px] font-semibold leading-[28px] text-black-light laptop:text-[18px]">
                        {event?.event_name}
                      </p>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-[14px] text-text-grey laptop:text-[16px]">
                        <CalendarIcon className="text-gray-500" />
                        <span>{formatLongDate(event?.start_date, "mid")}</span>
                        <span>-</span>
                        <span>{formatLongDate(event?.end_date, "mid")}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-[14px] text-text-grey laptop:text-[16px]">
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
                          <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-black-light">
                            {ticket.name}
                          </p>
                          <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
                            {ticket?.price === 0 ? "Free" : `₦ ${ticket?.price}`}
                          </p>
                          <p className="font-sans text-[12px] font-normal leading-[14.4px] text-text-grey">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[8px] bg-light-white p-3"
                            onClick={() => handleDecrement(index)}
                          >
                            <p className="">-</p>
                          </div>
                          <div className="flex h-[28px] w-[27.75px] items-center justify-center rounded-[8px] bg-light-white p-4">
                            <p className="font-sans text-[16px] font-semi-normal leading-[24px] tracking-custom">
                              {quantities[index]?.quantity}
                            </p>
                          </div>
                          <div
                            className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[8px] bg-light-white p-3"
                            onClick={() => handleIncrement(index)}
                          >
                            <p className="">+</p>
                          </div>
                        </div>
                      </div>
                      <div className="my-2 border-t-[1px] border-grey-20"></div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center gap-[16px] laptop:hidden">
                <div className="flex w-[147px] items-center gap-[16px]">
                  <p className="text-[20px] font-bold text-mid-green">
                    {totalAmount() === 0 ? (
                      <>₦ {totalAmount()}</>
                    ) : (
                      <>₦ {formatNumberWithCommas(totalAmount())}</>
                    )}
                  </p>
                  <ChevronUp
                    className="cursor-pointer text-mid-green"
                    onClick={toggleSummaryModal}
                  />
                </div>
                <Button
                  className="h-[48px] w-[180px] rounded-[12px] border-b-[2px] bg-gradient-green px-[48px] py-[14px] shadow-none"
                  onClick={proceed}
                >
                  <p className="text-[16px] font-semi-normal">Assign ticket</p>
                </Button>
              </div>
            </div>
            <div className="hidden laptop:block">
              <div className="w-[480px] rounded-[12px] bg-white px-[10px] py-[12px]">
                <p className="font-sans text-[20px] font-semibold leading-[28px]">Summary</p>
                {quantities?.map(
                  (quantity: TicketDetails, index: number) =>
                    quantity.quantity > 0 && (
                      <div className="mt-[16px] flex justify-between" key={index}>
                        <div>
                          <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                            {quantity.quantity} {quantity.ticket_name}
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-[14px] font-semibold leading-[21px] tracking-custom text-light-black">
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
                <div className="my-4 border-t-[1px] border-grey-20"></div>
                <div className="mt-[16px] flex justify-between">
                  <div>
                    <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-text-grey">
                      Subtotal
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[14px] font-semibold leading-[21px] tracking-custom text-light-black">
                      {calculateSubtotal() === 0 ? (
                        <>₦ {calculateSubtotal()}</>
                      ) : (
                        <>₦ {formatNumberWithCommas(calculateSubtotal())}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="my-4 border-t-[1px] border-grey-20"></div>
                <div className="mt-[16px] flex justify-between">
                  <div>
                    <p className="font-sans text-[18px] font-normal leading-[27px] tracking-custom text-text-grey">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom text-light-black">
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
                    <p className="pl-[40px] font-sans text-[18px] font-normal leading-[27px] tracking-custom text-text-grey">
                      -
                    </p>
                  </div>
                  <div>
                    <Button
                      className={
                        "h-[48px] w-[216px] gap-[8px] rounded-[12px] border-b-2 border-transparent bg-gradient-green px-[48px] py-[14px] shadow-custom-bottom"
                      }
                      onClick={proceed}
                    >
                      <p className="font-sans text-[16px] font-semi-normal leading-[19.2px]">
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

export default Page;
