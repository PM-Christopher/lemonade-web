"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import ClockIcon from "@/images/icons/clock.svg";
import { Button } from "@lemonade/ui";
import { useSearchParams } from "next/navigation";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import { TicketDetails, TicketInterface } from "@/interfaces/EventInterface";
import { useAppDispatch } from "@/redux/hook";
import { addTickets } from "@/features/events/event.slice";
import { useEventTicketDataQuery, useTicketQuoteQuery } from "@/features/events/queries";
import useDebounce from "@/hooks/useDebounce";
import { routes } from "@/lib/routes";
import { TicketQuoteBreakdown } from "@/components/events/TicketQuoteBreakdown";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronUp } from "lucide-react";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { EventTicketDetailSkeleton } from "@/components/Skeletons";

const TicketSummary = dynamic(() => import("@/components/events/Modals/TicketSummary"), {
  ssr: false,
});

const BuyTicketClient = ({ id }: { id: number }) => {
  const { push, back } = useNavigation();
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
          // Stop at the ticket's purchase limit
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

  const selectedTickets = quantities.filter((ticket) => ticket.quantity > 0);
  const selection = useMemo(
    () =>
      quantities
        .filter((ticket) => ticket.quantity > 0)
        .map((ticket) => ({ id: String(ticket.id), quantity: ticket.quantity })),
    [quantities],
  );
  // Wait for the stepper to settle before asking the server for a price.
  const { debouncedValue: debouncedSelection } = useDebounce(selection, 300);
  const quoteQuery = useTicketQuoteQuery(id, debouncedSelection);
  const hasSelection = selection.length > 0;
  const quoteState = {
    quote: quoteQuery.data,
    hasSelection,
    isPending: quoteQuery.isFetching || selection !== debouncedSelection,
    error: quoteQuery.error,
  };
  const totalLabel = hasSelection ? (quoteQuery.data?.total_display ?? "…") : "₦0.00";

  const referralFromUrl = searchParams.get("referral");
  const assignTicketHref = referralFromUrl
    ? `${routes.EVENT_ASSIGN_TICKET(id)}?referral=${encodeURIComponent(referralFromUrl)}`
    : routes.EVENT_ASSIGN_TICKET(id);

  const proceed = () => {
    if (selectedTickets.length === 0) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please select at least one ticket quantity before proceeding.",
          type: "error",
        }),
      );
      return;
    }
    // A new selection starts a fresh reservation timer.
    localStorage.removeItem(`ticketExpiryTime_${id}`);
    dispatch(addTickets({ tickets: selectedTickets }));
    push(assignTicketHref);
  };

  const toggleSummaryModal = () => {
    setSummaryModal(!summaryModal);
  };

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1" onClick={() => back()}>
            <ChevronLeft className="cursor-pointer" />
            <p className="tracking-custom text-body-l font-sans font-semibold">Buy ticket</p>
          </div>
        </div>
        <section className="laptop:bg-none laptop:pb-0 mt-4 bg-white pb-28">
          <div className="laptop:flex-row laptop:justify-around flex flex-col">
            <div className="laptop:w-172 laptop:bg-white laptop:p-6 flex w-full flex-col rounded-xl bg-none p-0 py-2.5">
              {loading ? (
                <EventTicketDetailSkeleton />
              ) : (
                <div className="">
                  <div className="bg-green-tint laptop:p-6 flex items-start gap-4 rounded-xl p-4">
                    {/* Event Poster */}
                    <div className="laptop:h-30 laptop:w-30 h-16 w-16 flex-shrink-0">
                      <FallbackImage
                        src={event?.event_image}
                        fallbackSrc={images.DEFAULT_EVENT}
                        alt={event?.event_name || "event poster"}
                        width={120}
                        height={120}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="text-black-light laptop:text-body-xl text-body-l font-sans leading-7 font-semibold">
                        {event?.event_name}
                      </p>

                      {/* Date */}
                      <div className="text-text-grey laptop:text-body-l text-body-s flex items-center gap-2">
                        <CalendarIcon className="text-gray-500" />
                        <span>{formatLongDate(event?.start_date, "mid")}</span>
                        <span>-</span>
                        <span>{formatLongDate(event?.end_date, "mid")}</span>
                      </div>

                      {/* Time */}
                      <div className="text-text-grey laptop:text-body-l text-body-s flex items-center gap-2">
                        <ClockIcon className="text-gray-500" />
                        <span>{formatTime(event?.start_date ?? null)}</span>
                        <span>-</span>
                        <span>{formatTime(event?.end_date ?? null)}</span>
                      </div>
                    </div>
                  </div>

                  {tickets?.map((ticket: TicketInterface, index: number) => (
                    <div className="laptop:none px-4" key={index}>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="font-semi-normal text-black-light text-body-s font-sans">
                            {ticket.name}
                          </p>
                          <p className="tracking-custom text-body-xl font-sans font-semibold">
                            {ticket.price === 0 ? "Free" : ticket.price_display}
                          </p>
                          <p className="text-text-grey text-meta font-sans font-normal">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Remove one ${ticket.name}`}
                            className="bg-light-white flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg p-3"
                            onClick={() => handleDecrement(index)}
                          >
                            -
                          </button>
                          <div className="bg-light-white flex h-7 w-7 items-center justify-center rounded-lg p-4">
                            <p
                              data-testid={`quantity-${ticket.id}`}
                              className="font-semi-normal tracking-custom text-body-l font-sans"
                            >
                              {quantities[index]?.quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Add one ${ticket.name}`}
                            className="bg-light-white flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg p-3"
                            onClick={() => handleIncrement(index)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="border-grey-20 my-2 border-t"></div>
                    </div>
                  ))}
                </div>
              )}
              <div className="laptop:hidden fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 bg-white p-4">
                <div className="flex items-center gap-3">
                  <p className="text-mid-green text-title-r leading-normal font-bold">
                    {totalLabel}
                  </p>
                  <button type="button" aria-label="Show summary" onClick={toggleSummaryModal}>
                    <ChevronUp className="text-mid-green cursor-pointer" />
                  </button>
                </div>
                <Button
                  className="bg-gradient-green h-12 w-45 rounded-xl border-b-2 px-12 py-3.5 shadow-none"
                  onClick={proceed}
                >
                  <p className="font-semi-normal text-body-l">Assign ticket</p>
                </Button>
              </div>
            </div>
            <div className="laptop:block hidden">
              <div className="w-120 rounded-xl bg-white p-4">
                <p className="text-title-r font-sans font-semibold">Summary</p>
                <TicketQuoteBreakdown {...quoteState} />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="tracking-custom text-text-grey text-body-xl pl-10 font-sans font-normal">
                      -
                    </p>
                  </div>
                  <div>
                    <Button
                      className={
                        "bg-gradient-green h-12 w-54 gap-2 rounded-xl border-b-2 border-transparent px-12 py-3.5"
                      }
                      onClick={proceed}
                    >
                      <p className="font-semi-normal text-field font-sans">Assign ticket</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <TicketSummary
        isOpen={summaryModal}
        toggle={toggleSummaryModal}
        totalLabel={totalLabel}
        quoteState={quoteState}
        proceed={proceed}
      />
    </MainLayout>
  );
};

export default BuyTicketClient;
