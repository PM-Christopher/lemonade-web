import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import DotIcon from "@/images/icons/dot.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatLongDate, formatTime } from "@/lib/dateTimeFormatter";

interface ImageSlider {
  showArrows: boolean;
  showDots: boolean;
  events: EventInterface[];
}

const Carousel: React.FC<ImageSlider> = ({
  showArrows = false,
  showDots = true,
  events,
}: ImageSlider) => {
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
    <div className="relative w-full overflow-hidden rounded-2xl bg-black/5 shadow-lg">
      {/* Responsive height via aspect ratio */}
      <div className="sm:aspect-[16/9] lg:aspect-[21/9] relative aspect-[16/10] w-full">
        {events?.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "pointer-events-none opacity-0"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          </div>
        ))}

        {/* Arrows */}
        {showArrows && (events?.length ?? 0) > 1 && (
          <div className="sm:px-3 absolute inset-0 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="sm:h-11 sm:w-11 group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow backdrop-blur-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-95"
            >
              <svg
                className="sm:w-6 sm:h-6 h-5 w-5 text-gray-900 transition group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="sm:h-11 sm:w-11 group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow backdrop-blur-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-95"
            >
              <svg
                className="sm:w-6 sm:h-6 h-5 w-5 text-gray-900 transition group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom info panel */}
        <div className="sm:p-4 lg:p-6 absolute bottom-0 left-0 right-0 p-3">
          <div className="mx-auto w-full max-w-[980px] rounded-2xl border border-white/10 bg-[#1A2600]/20 shadow-lg backdrop-blur-xl">
            <div className="sm:gap-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6 flex flex-col gap-3 px-4 py-4">
              {/* Text */}
              <div className="min-w-0">
                <p className="sm:text-[22px] lg:text-[28px] truncate font-sans text-[18px] font-semibold leading-tight text-white">
                  {events?.[currentIndex]?.event_name}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-white/90">
                  <div className="flex items-center gap-[6px]">
                    <CalendarIcon className="h-4 w-4 text-white" />
                    <p className="sm:text-[14px] font-sans text-[13px] font-normal leading-[16.8px]">
                      {formatLongDate(events?.[currentIndex]?.start_date, "mid")}
                    </p>
                  </div>

                  <DotIcon className="h-[4px] w-[4px]" />

                  <p className="sm:text-[14px] font-sans text-[13px] font-normal leading-[16.8px]">
                    {formatTime(events?.[currentIndex]?.start_date)} -{" "}
                    {formatTime(events?.[currentIndex]?.end_date)}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="sm:justify-end flex">
                <button
                  type="button"
                  className="sm:w-auto sm:text-[16px] inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-sans text-[14px] font-semi-normal leading-[19.2px] text-white transition hover:bg-white/20"
                >
                  Get ticket
                </button>
              </div>
            </div>

            {/* Dots (scrollable on mobile, centered on desktop) */}
            {(events?.length ?? 0) > 1 && (
              <div className="sm:px-5 lg:px-6 px-4 pb-4">
                <div className="hide-scrollbar sm:justify-center flex items-center gap-2 overflow-x-auto">
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
};

export default Carousel;
