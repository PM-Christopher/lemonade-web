"use client"
import React, {useRef, useState} from 'react';
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/divider.svg";
import More from "@/images/icons/moreIcon.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatLongDate, formatTime} from "@/lib/dateTimeFormatter";
import PencilIcon from "@/images/icons/pencilIcon.svg"
import TrashIcon from "@/images/icons/trashIcon.svg"
import {useRouter} from "next/navigation";
import GoLive from "@/images/icons/goLive.svg"
import {useAppDispatch} from "@/redux/hook";
import {usePublishEventMutation} from "@/features/events/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type OrganizerEventInterface = {
    draft: boolean
    event: EventInterface
}

interface ModalPosition {
    top: number;
    left: number;
}

const OrganizerEventCard: React.FC<OrganizerEventInterface> = ({draft, event}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
    const moreIconRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const publishEventMutation = usePublishEventMutation()
    const loading = publishEventMutation.isPending

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
                    })
                );
            },
        })
    }

    return (
        <div className="bg-white rounded-[12px] mb-[16px] border-[1px] border-grey-20 p-[4px]">
            <div className="flex flex-col">
                <div className="relative">
                    <Image src={event?.event_image} alt="event_1"
                           className="rounded-[8px] w-full laptop:w-[230px] h-[150px] laptop:h-[230px]" width={230}
                           height={230}/>
                    {
                        draft && (
                            <div
                                className="absolute top-0 right-0 bg-warning p-[4px] px-[8px] rounded-tl-[0px] rounded-bl-[8px] rounded-tr-[8px] rounded-br-[8px]">
                                <p className="text-[14px] leading-[16.8px] font-sans font-semibold text-warning-bold text-center">Draft</p>
                            </div>
                        )
                    }
                </div>
                <div className="flex justify-between mt-2 px-2">
                    <div className="">
                        <p className="font-sans font-semibold text-[14px] laptop:text-[18px] leading-[27px] tracking-custom max-w-[150px] truncate">
                            {event?.event_name}
                        </p>
                        <div className="flex items-center gap-1 my-2">
                            <CalendarIcon className="w-[12px] h-[12px]"/>
                            <p className="font-sans font-normal text-[12px] laptop:text-[14px] leading-[16.8px] text-text-grey">
                                {formatLongDate(event?.start_date, 'mid')}
                            </p>
                            <DotIcon className="w-[3px]"/>
                            <p className="font-sans font-normal text-[12px] laptop:text-[14px] leading-[16.8px] text-text-grey">
                                {formatTime(event?.start_date)}
                            </p>
                        </div>
                    </div>
                    <div ref={moreIconRef}>
                        <More className="cursor-pointer" onClick={handleMoreIconClick}/>
                    </div>
                    {isModalVisible && modalPosition && (
                        <div
                            className="absolute bg-white shadow-lg rounded-xl z-10 flex flex-col border border-gray-100"
                            style={{
                                top: modalPosition.top,
                                left: modalPosition.left,
                                minWidth: "190px",
                            }}
                        >
                            {/* Menu Item */}
                            <button
                                onClick={() => router.push(`/event/${event.id}/edit-event`)}
                                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left rounded-t-xl"
                            >
                                <PencilIcon className="w-4 h-4 text-gray-500"/>
                                <span className="text-sm font-medium">Edit Event</span>
                            </button>

                            {/* Go Live - only if draft */}
                            {draft && (
                                <button
                                    onClick={() => publishDraftEvent(event.id)}
                                    disabled={loading} // disable while loading
                                    className={`flex items-center gap-2 px-4 py-3 transition-colors w-full text-left ${
                                        loading
                                            ? "text-green-400 cursor-not-allowed bg-green-50"
                                            : "text-green-600 hover:bg-green-50"
                                    }`}
                                >
                                    {loading ? (
                                        <svg
                                            className="animate-spin h-4 w-4 text-green-600"
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
                                        <GoLive className="w-4 h-4 text-green-600"/>
                                    )}
                                    <span className="text-sm font-medium">
          {loading ? "Going Live..." : "Go Live"}
        </span>
                                </button>
                            )}


                            {/* Delete */}
                            <button
                                className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left rounded-b-xl"
                            >
                                <TrashIcon className="w-4 h-4 text-red-600"/>
                                <span className="text-sm font-medium">Delete Event</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrganizerEventCard;