import React, {useState, useEffect} from 'react';
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

    // Auto-slide functionality
    useEffect(() => {
        const slideInterval = setInterval(() => {
            nextSlide();
        }, 3000); // Slide every 3 seconds

        return () => clearInterval(slideInterval); // Clean up on unmount
    }, [currentIndex]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? events.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === events.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative w-full h-[488px] overflow-hidden rounded-[12px] shadow-lg">
            {events?.map((image, index) => (
                <div
                    key={index}
                    className={`inset-0 w-full transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex
                            ? "flex"
                            : "hidden"
                    }`}
                >
                    <Image
                        key={index}
                        src={image?.event_image}
                        alt={`Slide ${index}`}
                        fill={true}
                    />
                </div>
            ))}

            {/* Arrows */}
            {
                showArrows && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            onClick={prevSlide}
                            className="bg-white/60 rounded-full p-2 shadow hover:bg-gray-100"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="bg-white/60 rounded-full p-2 shadow hover:bg-gray-100"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                )
            }

            {/* Dots */}
            {
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-[#1A2600]/10 backdrop-blur-lg flex flex-col w-[540px] pt-[32px] pb-[16px] px-[24px]">
                        <div
                            className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-white font-semibold font-sans text-[32px] leading-[44.8px]">
                                    {events[currentIndex]?.event_name}
                                </p>
                                <div className="flex gap-2 items-center">
                                    <CalendarIcon className="text-white w-[14px]" />
                                    <p className="text-white font-sans font-normal text-[14px] leading-[16.8px]">
                                        {formatLongDate(events[currentIndex]?.start_date, "mid")}
                                    </p>
                                    <DotIcon className="w-[4px] h-[4px]"/>
                                    <p className="text-white font-sans font-normal text-[14px] leading-[16.8px]">
                                        {formatTime(events[currentIndex]?.start_date)} - {formatTime(events[currentIndex]?.end_date)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="border-[1px] border-light-grey-50 p-[10px] px-[12px] rounded-[12px]">
                                    <p className="text-white text-[16px] font-sans font-semi-normal leading-[19.2px]">Get
                                        ticket</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            {events?.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 mx-[2px] rounded-full cursor-pointer ${
                                        currentIndex === index ? 'bg-step-color' : 'bg-white'
                                    }`}
                            ></div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Carousel;