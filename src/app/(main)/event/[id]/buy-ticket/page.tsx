"use client";
import React, { useState, useEffect } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { TicketDetails, TicketInterface } from "@/interfaces/EventInterface";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { addTickets } from "@/features/events/event.slice";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronUp } from "lucide-react";
import TicketSummary from "@/components/events/Modals/TicketSummary";

const Page = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };
  const [summaryModal, setSummaryModal] = useState(false);

  const { data, loading } = useRequest(
    `/events/attendees/${params.id}/tickets`,
    "GET",
    {},
    true,
    getHeader()
  );

  const [quantities, setQuantities] = useState<TicketDetails[]>([]);

  useEffect(() => {
    if (data?.tickets) {
      const initialQuantities = data.tickets.map((ticket: TicketInterface) => ({
        id: ticket.id,
        ticket_name: ticket.name,
        ticket_description: ticket.description,
        quantity: 0,
        price: ticket.price,
        purchase_limit: ticket.purchase_limit,
      }));
      setQuantities(initialQuantities);
    }
  }, [data]);

  const handleIncrement = (index: number) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((ticketDetail, i) => {
        if (i === index) {
          // Only increment if quantity is less than purchase_limit
          if (ticketDetail.quantity < ticketDetail.purchase_limit) {
            return { ...ticketDetail, quantity: ticketDetail.quantity + 1 };
          }
        }
        return ticketDetail;
      })
    );
  };

  const handleDecrement = (index: number) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((ticketDetail, i) =>
        i === index && ticketDetail.quantity > 0
          ? { ...ticketDetail, quantity: ticketDetail.quantity - 1 }
          : ticketDetail
      )
    );
  };

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    return quantities.reduce((total, ticket) => {
      return total + ticket.quantity * ticket.price;
    }, 0);
  };

  const totalAmount = () => {
    return 2000 + calculateSubtotal();
  };

  const proceed = () => {
    const data = {
      tickets: quantities,
      total: totalAmount(),
    };
    dispatch(addTickets(data));
    router.push(`/event/${params.id}/assign-ticket`);
  };

  const toggleSummaryModal = () => {
    setSummaryModal(!summaryModal);
  };

  return (
    <MainLayout>
      <section className="bg-white laptop:bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[12px] px-10 border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
            onClick={() => router.back()}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Buy ticket
            </p>
          </div>
        </div>
        <section className="mt-4 bg-white laptop:bg-none">
          <div className="flex flex-col laptop:flex-row laptop:justify-around">
            <div className="bg-none laptop:bg-white w-full laptop:w-[688px] p-0 laptop:p-[24px] rounded-[12px] flex flex-col justify-between gap-y-[460px] py-[10px]">
              <div className="">
                <div className="bg-green-tint flex gap-[4px] p-[12px] px-[16px] rounded-[8px]">
                  <div className="w-[72px] h-[72px] laptop:w-[120px] laptop:h-[120px]">
                    <Image
                      src={data?.event?.event_image}
                      alt="poster"
                      width={120}
                      height={120}
                      className="rounded-[12px]"
                    />
                  </div>
                  <div className="gap-[4px]">
                    <p className="font-sans font-semi-normal text-[16px] laptop:text-[18px] leading-[27px] text-black-light">
                      {data?.event?.event_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="font-sans font-normal text-[14px] laptop:text-[16px] leading-[24px] tracking-custom text-text-grey">
                        {formatLongDate(data?.event.start_date, "mid")}
                      </p>
                      <p>-</p>
                      <p className="font-sans font-normal text-[14px] laptop:text-[16px] leading-[24px] tracking-custom text-text-grey">
                        {formatLongDate(data?.event.end_date, "mid")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon />
                      <p className="font-sans font-normal text-[14px] laptop:text-[16px] leading-[24px] text-text-grey">
                        {formatTime(data?.event.start_date)}
                      </p>
                      <p>-</p>
                      <p className="font-sans font-normal text-[14px] laptop:text-[16px] leading-[24px] text-text-grey">
                        {formatTime(data?.event.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
                {data?.tickets?.map(
                  (ticket: TicketInterface, index: number) => (
                    <div className="px-[16px] laptop:none">
                      <div className="flex justify-between mt-[24px] items-center">
                        <div className="flex flex-col">
                          <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-black-light">
                            {ticket.name}
                          </p>
                          <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                            {ticket?.price === 0
                              ? "Free"
                              : `₦ ${ticket?.price}`}
                          </p>
                          <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div
                            className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                            onClick={() => handleDecrement(index)}
                          >
                            <p className="">-</p>
                          </div>
                          <div className="p-4 rounded-[8px] bg-light-white w-[27.75px] h-[28px] flex items-center justify-center">
                            <p className="text-[16px]  font-sans font-semi-normal leading-[24px] tracking-custom">
                              {quantities[index]?.quantity}
                            </p>
                          </div>
                          <div
                            className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                            onClick={() => handleIncrement(index)}
                          >
                            <p className="">+</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-grey-20 my-2"></div>
                    </div>
                  )
                )}
              </div>
              <div className="flex laptop:hidden items-center justify-center gap-[16px]">
                <div className="flex gap-[16px] items-center w-[147px]">
                  <p className="text-[20px] font-bold text-mid-green">
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
                  className="px-[48px] py-[14px] bg-gradient-green w-[180px] h-[48px] rounded-[12px] border-b-[2px] shadow-none"
                  onClick={proceed}
                >
                  <p className="font-semi-normal text-[16px]">Assign ticket</p>
                </Button>
              </div>
            </div>
            <div className="hidden laptop:block">
              <div className="bg-white w-[480px] px-[10px] py-[12px] rounded-[12px]">
                <p className="font-sans font-semibold text-[20px] leading-[28px]">
                  Summary
                </p>
                {quantities?.map(
                  (quantity: TicketDetails, index: number) =>
                    quantity.quantity > 0 && (
                      <div
                        className="flex justify-between mt-[16px]"
                        key={index}
                      >
                        <div>
                          <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">
                            {quantity.quantity} {quantity.ticket_name}
                          </p>
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">
                            {quantity.price * quantity.quantity === 0 ? (
                              <>₦ {quantity.price * quantity.quantity}</>
                            ) : (
                              <>
                                ₦{" "}
                                {formatNumberWithCommas(
                                  quantity.price * quantity.quantity
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                )}
                <div className="border-t-[1px] border-grey-20 my-4"></div>
                <div className="flex justify-between mt-[16px]">
                  <div>
                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">
                      Subtotal
                    </p>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">
                      {calculateSubtotal() === 0 ? (
                        <>₦ {calculateSubtotal()}</>
                      ) : (
                        <>₦ {formatNumberWithCommas(calculateSubtotal())}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-[16px]">
                  <div>
                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">
                      Fee
                    </p>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">
                      ₦ 2,000
                    </p>
                  </div>
                </div>
                <div className="border-t-[1px] border-grey-20 my-4"></div>
                <div className="flex justify-between mt-[16px]">
                  <div>
                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[27px] text-[18px]">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[27px] text-[18px]">
                      {totalAmount() === 0 ? (
                        <>₦ {totalAmount()}</>
                      ) : (
                        <>₦ {formatNumberWithCommas(totalAmount())}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-[20px] items-center">
                  <div>
                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[27px] text-[18px] pl-[40px]">
                      -
                    </p>
                  </div>
                  <div>
                    <Button
                      className={
                        "bg-gradient-green w-[216px] h-[48px] py-[14px] px-[48px] gap-[8px] rounded-[12px] border-b-2 border-transparent shadow-custom-bottom"
                      }
                      onClick={proceed}
                    >
                      <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">
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
