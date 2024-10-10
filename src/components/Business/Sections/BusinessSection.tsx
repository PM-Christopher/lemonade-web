import React from 'react';
import trending_event from "@/image/event_images/trending_event_1.png";
import BusinessCarousel from "@/components/global/BusinessCarousel";
import AllBusinessCard from "@/components/Business/AllBusinessCard";

const slideImages = [
    trending_event,
    trending_event,
];
const BusinessSection = () => {
    return (
        <section className="min-h-screen mt-4 flex flex-col items-center">
            <div className="p-[16px] w-[1312px] rounded-[12px] gap-[12px] bg-light-green-50">
                <p className="font-semibold text-[18px]">Featured</p>
                <BusinessCarousel images={slideImages} showDots={false} showArrows={false}/>
            </div>
            <div className="p-[16px] rounded-[12px] w-[1312px] shadow-sm mt-[24px]">
                <p className="font-semibold text-[18px]">All business</p>
                <div className="grid grid-cols-4 gap-2">
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                    <AllBusinessCard />
                </div>
            </div>
        </section>
    );
}

export default BusinessSection;