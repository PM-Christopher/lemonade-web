"use client"
import React from 'react';
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/events/EventCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {EventInterface} from "@/interfaces/EventInterface";
import Link from "next/link";

const EventsSectionView: React.FC = () => {
    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`/events/attendees`, "GET", {}, true, getHeader())

    return (
        <section className="mt-4 flex flex-col items-center">
            <div className="bg-light-green-50 p-[24px] w-[1008px] rounded-[12px] flex justify-center">
                {
                    !loading && (
                        <Carousel events={data?.trending} showDots={true} showArrows={false}/>
                    )
                }
            </div>
            <div className="w-[1008px] rounded-[12px] mt-[48px]">
                <p className="font-sans font-semibold text-[20px] leading-[28px] mb-[16px]">This week</p>
                <div className="grid grid-cols-3 gap-2">
                    {
                        data?.this_week.map((event: EventInterface, index: number) => (
                            <Link href={`/event/${event?.id}`}>
                                <EventCard event={event} key={index}/>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}

export default EventsSectionView;