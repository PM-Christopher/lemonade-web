import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const totalImages = images.length;

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* ======= CAROUSEL ======= */}
      <div className="group relative mx-auto mt-4 w-full max-w-[736px] overflow-hidden rounded-xl">
        <div
          className="sm:h-[400px] md:h-[450px] lg:h-[500px] relative h-[300px] cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[current]}
            alt={`slide-${current}`}
            fill
            priority
            className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 transform rounded-full bg-white/70 p-2 text-gray-800 opacity-0 shadow-md transition hover:bg-white group-hover:opacity-100"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full bg-white/70 p-2 text-gray-800 opacity-0 shadow-md transition hover:bg-white group-hover:opacity-100"
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 flex w-full justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(index);
              }}
              className={`h-[8px] w-[8px] rounded-full transition-all ${
                index === current ? "scale-125 bg-white shadow" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ======= LIGHTBOX ======= */}
      {lightboxOpen && (
        <div
          className="sm:p-6 fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={images[current]}
                alt="lightbox"
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
              />

              {/* X icon inside the image */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <X size={18} />
              </button>
            </div>

            {/* Prev/Next inside lightbox */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 rounded-full bg-white/60 p-2 text-gray-900 transition hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 rounded-full bg-white/60 p-2 text-gray-900 transition hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
