"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/divider.svg";
import More from "@/images/icons/moreIcon.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";
import PencilIcon from "@/images/icons/pencilIcon.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import { useRouter } from "next/navigation";
import GoLive from "@/images/icons/goLive.svg";
import { useAppDispatch } from "@/redux/hook";
import { usePublishEventMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type OrganizerEventInterface = {
  draft: boolean;
  event: EventInterface;
};

interface ModalPosition {
  top: number;
  left: number;
}

const OrganizerEventCard: React.FC<OrganizerEventInterface> = ({ draft, event }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
  const moreIconRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const publishEventMutation = usePublishEventMutation();
  const loading = publishEventMutation.isPending;

  const handleMoreIconClick = (e: React.MouseEvent) => {
    if (moreIconRef.current) {
      const rect = moreIconRef.current.getBoundingClientRect();
      const position: ModalPosition = {
        top: rect.bottom + window.scrollY - 40,
        left: rect.right + window.scrollX - 150, // Adjust modal position relative to the button
      };
      setModalPosition(position);
    }
    setModalVisible(!isModalVisible); // Toggle modal visibility
  };

  const publishDraftEvent = (id: number) => {
    publishEventMutation.mutate(id, {
      onSuccess: () => {
        setModalVisible(!isModalVisible);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Your event has been published",
            type: "success",
          }),
        );
      },
    });
  };

  return (
    <div className="mb-[16px] rounded-[12px] border-[1px] border-grey-20 bg-white p-[4px]">
      <div className="flex flex-col">
        <div className="relative">
          <Image
            src={event?.event_image}
            alt="event_1"
            className="h-[150px] w-full rounded-[8px] laptop:h-[230px] laptop:w-[230px]"
            width={230}
            height={230}
          />
          {draft && (
            <div className="absolute right-0 top-0 rounded-bl-[8px] rounded-br-[8px] rounded-tl-[0px] rounded-tr-[8px] bg-warning p-[4px] px-[8px]">
              <p className="text-center font-sans text-[14px] font-semibold leading-[16.8px] text-warning-bold">
                Draft
              </p>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between px-2">
          <div className="">
            <p className="max-w-[150px] truncate font-sans text-[14px] font-semibold leading-[27px] tracking-custom laptop:text-[18px]">
              {event?.event_name}
            </p>
            <div className="my-2 flex items-center gap-1">
              <CalendarIcon className="h-[12px] w-[12px]" />
              <p className="font-sans text-[12px] font-normal leading-[16.8px] text-text-grey laptop:text-[14px]">
                {formatLongDate(event?.start_date, "mid")}
              </p>
              <DotIcon className="w-[3px]" />
              <p className="font-sans text-[12px] font-normal leading-[16.8px] text-text-grey laptop:text-[14px]">
                {formatTime(event?.start_date)}
              </p>
            </div>
          </div>
          <div ref={moreIconRef}>
            <More className="cursor-pointer" onClick={handleMoreIconClick} />
          </div>
          {isModalVisible && modalPosition && (
            <div
              className="absolute z-10 flex flex-col rounded-xl border border-gray-100 bg-white shadow-lg"
              style={{
                top: modalPosition.top,
                left: modalPosition.left,
                minWidth: "190px",
              }}
            >
              {/* Menu Item */}
              <button
                onClick={() => router.push(`/event/${event.id}/edit-event`)}
                className="flex w-full items-center gap-2 rounded-t-xl px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Edit Event</span>
              </button>

              {/* Go Live - only if draft */}
              {draft && (
                <button
                  onClick={() => publishDraftEvent(event.id)}
                  disabled={loading} // disable while loading
                  className={`flex w-full items-center gap-2 px-4 py-3 text-left transition-colors ${
                    loading
                      ? "cursor-not-allowed bg-green-50 text-green-400"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  {loading ? (
                    <svg
                      className="h-4 w-4 animate-spin text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <GoLive className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium">
                    {loading ? "Going Live..." : "Go Live"}
                  </span>
                </button>
              )}

              {/* Delete */}
              <button className="flex w-full items-center gap-2 rounded-b-xl px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50">
                <TrashIcon className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Delete Event</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
