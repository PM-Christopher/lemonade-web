import React from 'react';
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/Events/EventCard";
import trending_event from "@/image/event_images/trending_event_1.png";

const slideImages = [
    trending_event,
    trending_event,
];

const EventsSectionView: React.FC = () => {
    return (
        <section className="min-h-screen mt-4 flex flex-col items-center">
            <div className="bg-light-green-50 p-[24px] w-[1008px] rounded-[12px] flex justify-center">
                <Carousel images={slideImages} showDots={true} showArrows={false}/>
            </div>
            <div className="w-[1008px] rounded-[12px] mt-[48px]">
                <p className="font-sans font-semibold text-[20px] leading-[28px] mb-[16px]">This week</p>
                <div className="grid grid-cols-3 gap-2">
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                </div>
            </div>
        </section>
    );
}

export default EventsSectionView;