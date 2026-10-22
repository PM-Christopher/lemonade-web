"use client";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { CalendarIcon, ClockIcon, DownloadIcon, MapPinIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useEventPromotionQuery } from "@/features/events/queries";
import { useCompleteEventPromotionMutation } from "@/features/events/mutations";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";

const ChatModal = dynamic(() => import("@/modals/users/ChatModal"), { ssr: false });
const SchedulePromotionModal = dynamic(() => import("@/modals/events/SchedulePromotionModal"), {
  ssr: false,
});

const SummaryRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className={"flex gap-6"}>
    <div className={"w-28.75 shrink-0"}>
      <p className={"text-text-grey text-meta leading-normal font-medium"}>{label}</p>
    </div>
    <div className={"text-body-s font-medium"}>{children}</div>
  </div>
);

const EventPromotionDetailsClient = ({ id }: { id: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useEventPromotionQuery(id, { enabled: isLoggedIn });
  const completeMutation = useCompleteEventPromotionMutation(id);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const summary = data?.event_summary;
  const event = data?.event;
  const isCompleted = summary?.status === "completed";

  const markCompleted = () => {
    completeMutation.mutate(undefined, {
      onSuccess: () =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Promotion marked as completed"),
            type: "success",
          }),
        ),
    });
  };

  return (
    <>
      <section className={"flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:justify-between"}>
        <div className={"flex h-fit w-full flex-col gap-3 rounded-xl bg-white lg:w-147"}>
          <div className={"flex items-center justify-between border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Event summary</p>
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            <SummaryRow label={"Event Name:"}>{summary?.event_name}</SummaryRow>
            <SummaryRow label={"Event Owner:"}>
              <span className={"flex items-center gap-3"}>
                {summary?.owner}
                {summary?.owner_id && (
                  <button
                    type="button"
                    className={"text-light-green-70 cursor-pointer font-medium"}
                    onClick={() => setChatOpen(true)}
                  >
                    Open chat
                  </button>
                )}
              </span>
            </SummaryRow>
            <SummaryRow label={"Promotion ID:"}>{summary?.unique_id ?? "N/A"}</SummaryRow>
            <SummaryRow label={"Promotion Name:"}>{summary?.promotion_name}</SummaryRow>
            <SummaryRow label={"Amount:"}>
              ₦{Number(summary?.promotion_price ?? 0).toLocaleString()}
            </SummaryRow>
            <SummaryRow label={"Date Paid:"}>
              {summary?.date_paid ? dayjs(summary.date_paid).format("DD MMM, YYYY hh:mm A") : "N/A"}
            </SummaryRow>
            <SummaryRow label={"Promotion Date:"}>
              {summary?.promotion_date
                ? dayjs(summary.promotion_date).format("DD MMM, YYYY")
                : "N/A"}
            </SummaryRow>
            <SummaryRow label={"Promotion Status:"}>
              <span className={GetStatusClass(capitalizeWords(summary?.status))}>
                {capitalizeWords(summary?.status)}
              </span>
            </SummaryRow>
            {isCompleted ? null : (
              <div className={"mt-10 flex justify-between gap-6"}>
                <button
                  className={
                    "border-light-grey-50 h-12 flex-1 rounded-xl border-2 px-6 disabled:opacity-70"
                  }
                  type={"button"}
                  onClick={markCompleted}
                  disabled={completeMutation.isPending}
                >
                  Mark as completed
                </button>
                <button
                  className={
                    "border-step-color bg-gradient-green text-body-l h-12 flex-1 rounded-xl border px-6 font-medium text-white"
                  }
                  type={"button"}
                  onClick={() => setIsScheduleOpen(true)}
                >
                  {summary?.promotion_date ? "Reschedule" : "Schedule"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={"flex h-fit w-full flex-col gap-4 rounded-xl bg-white p-6 lg:w-220"}>
          {event?.image ? (
            <div className={"relative w-80"}>
              <Image
                src={event.image}
                alt={event.name ?? ""}
                width={320}
                height={343}
                unoptimized
                className={"h-85.75 w-80 rounded-2xl object-cover"}
              />
              <a
                href={event.image}
                download
                target="_blank"
                rel="noopener noreferrer"
                className={
                  "text-meta absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-white px-3 py-1 font-medium"
                }
              >
                <DownloadIcon className={"h-3.5 w-3.5"} /> Download
              </a>
            </div>
          ) : null}
          <p className={"font-semiBold text-title-r leading-normal"}>{event?.name}</p>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex items-center gap-2"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-body-s font-medium"}>{event?.event_date}</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-body-s font-medium"}>{event?.event_time}</p>
            </div>
            {event?.location ? (
              <div className={"flex items-center gap-2"}>
                <MapPinIcon className={"text-text-grey"} />
                <p className={"text-text-grey text-body-s font-medium"}>{event.location}</p>
              </div>
            ) : null}
          </div>
          {event?.description ? (
            <>
              <p className={"font-semiBold text-body-l"}>About Event</p>
              <p className={"text-text-grey text-body-s font-normal"}>{event.description}</p>
            </>
          ) : null}
        </div>
      </section>
      <SchedulePromotionModal
        isOpen={isScheduleOpen}
        toggle={() => setIsScheduleOpen(false)}
        id={id}
        currentDate={summary?.promotion_date}
      />
      {chatOpen && summary?.owner_id && (
        <ChatModal
          isOpen
          toggle={() => setChatOpen(false)}
          userId={summary.owner_id}
          userName={summary.owner}
        />
      )}
    </>
  );
};

export default EventPromotionDetailsClient;
