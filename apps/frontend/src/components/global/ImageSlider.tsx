import React, {useState, useEffect, useCallback} from 'react';
import Image from "next/image";
import {CalendarIcon} from "lucide-react";
import DotIcon from "@/images/icons/dot.svg"
import {EventInterface} from "@/interfaces/EventInterface";
import {formatLongDate, formatTime} from "@/lib/dateTimeFormatter";

interface ImageSlider {
    showArrows: boolean,
    showDots: boolean,
    events: EventInterface[]
}

const Carousel: React.FC<ImageSlider> = ({showArrows = false, showDots = true, events}: ImageSlider) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === events.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, events.length]);

    // Auto-slide functionality
    useEffect(() => {
        const slideInterval = setInterval(() => {
            nextSlide();
        }, 3000); // Slide every 3 seconds

        return () => clearInterval(slideInterval); // Clean up on unmount
    }, [nextSlide]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? events.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black/5">
            {/* Responsive height via aspect ratio */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]">
                {events?.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <Image
                            src={item?.event_image}
                            alt={item?.event_name ? `${item.event_name} banner` : `Slide ${index + 1}`}
                            fill
                            priority={index === 0}
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
                        />

                        {/* Readability overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
                    </div>
                ))}

                {/* Arrows */}
                {showArrows && (events?.length ?? 0) > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-3">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous slide"
                            className="group inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/70 backdrop-blur-md shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-95 transition"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-105 transition"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next slide"
                            className="group inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/70 backdrop-blur-md shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-95 transition"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-105 transition"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Bottom info panel */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                    <div
                        className="mx-auto w-full max-w-[980px] rounded-2xl bg-[#1A2600]/20 backdrop-blur-xl border border-white/10 shadow-lg">
                        <div
                            className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 lg:px-6 py-4">
                            {/* Text */}
                            <div className="min-w-0">
                                <p className="text-white font-semibold font-sans text-[18px] sm:text-[22px] lg:text-[28px] leading-tight truncate">
                                    {events?.[currentIndex]?.event_name}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 items-center text-white/90">
                                    <div className="flex gap-[6px] items-center">
                                        <CalendarIcon className="text-white w-4 h-4"/>
                                        <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[16.8px]">
                                            {formatLongDate(events?.[currentIndex]?.start_date, "mid")}
                                        </p>
                                    </div>

                                    <DotIcon className="w-[4px] h-[4px]"/>

                                    <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[16.8px]">
                                        {formatTime(events?.[currentIndex]?.start_date)} - {formatTime(events?.[currentIndex]?.end_date)}
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex sm:justify-end">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 border border-white/25 bg-white/10 hover:bg-white/20 text-white font-sans font-semi-normal text-[14px] sm:text-[16px] leading-[19.2px] transition"
                                >
                                    Get ticket
                                </button>
                            </div>
                        </div>

                        {/* Dots (scrollable on mobile, centered on desktop) */}
                        {(events?.length ?? 0) > 1 && (
                            <div className="px-4 sm:px-5 lg:px-6 pb-4">
                                <div
                                    className="flex items-center gap-2 overflow-x-auto hide-scrollbar sm:justify-center">
                                    {events?.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            aria-label={`Go to slide ${index + 1}`}
                                            onClick={() => goToSlide(index)}
                                            className={`h-2.5 rounded-full transition-all ${
                                                currentIndex === index
                                                    ? "w-8 bg-step-color"
                                                    : "w-2.5 bg-white/70 hover:bg-white"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Carousel;