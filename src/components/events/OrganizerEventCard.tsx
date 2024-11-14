"use client"
import React, { useRef, useState } from 'react';
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/divider.svg";
import More from "@/images/icons/moreIcon.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatLongDate, formatTime} from "@/lib/dateTimeFormatter";
import PencilIcon from "@/images/icons/pencilIcon.svg"
import TrashIcon from "@/images/icons/trashIcon.svg"
import {useRouter} from "next/navigation";

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

    // Close the modal if clicked outside
    // useEffect(() => {
    //     const handleClickOutside = (e: MouseEvent) => {
    //         if (
    //             moreIconRef.current &&
    //             !moreIconRef.current.contains(e.target as Node)
    //         ) {
    //             setModalVisible(false);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    return (
        <div className="bg-white rounded-[12px] mb-[16px] border-[1px] border-grey-20 p-[4px]">
            <div className="flex flex-col">
                <div className="relative">
                    <Image src={event?.event_image} alt="event_1" className="rounded-[8px] w-full laptop:w-[230px] h-[150px] laptop:h-[230px]" width={230} height={230}/>
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
                        <More className="cursor-pointer" onClick={handleMoreIconClick} />
                    </div>
                    {isModalVisible && modalPosition && (
                        <div
                            className="absolute bg-white shadow-lg p-4 z-10 rounded-[12px] flex flex-col"
                            style={{
                                top: modalPosition.top,
                                left: modalPosition.left,
                                minWidth: "150px",
                            }}
                        >
                            <div className="p-[12px] px-[16px] flex gap-[8px] items-center w-[170px] cursor-pointer" onClick={() => router.push(`/event/${event.id}/edit-event`)}>
                                <PencilIcon className="w-[16.25px] h-[16.25px]" />
                                <p className="font-normal text-[16px] text-black-light">Edit event</p>
                            </div>
                            <div className="p-[12px] px-[16px] flex gap-[8px] items-center w-[170px] cursor-pointer">
                                <TrashIcon className="w-[16.25px] h-[16.25px]" />
                                <p className="text-red-1 font-normal text-[16px]">Delete event</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrganizerEventCard;