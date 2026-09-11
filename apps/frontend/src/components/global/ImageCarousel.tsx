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
            <div className="relative w-full max-w-[736px] mx-auto overflow-hidden rounded-xl mt-4 group">
                <div
                    className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                >
                    <Image
                        src={images[current]}
                        alt={`slide-${current}`}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02] rounded-xl"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                    <ChevronLeft size={22} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                    <ChevronRight size={22} />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 w-full flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrent(index);
                            }}
                            className={`w-[8px] h-[8px] rounded-full transition-all ${
                                index === current
                                    ? "bg-white scale-125 shadow"
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* ======= LIGHTBOX ======= */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <Image
                                src={images[current]}
                                alt="lightbox"
                                width={1200}
                                height={800}
                                className="w-auto max-w-full max-h-[85vh] rounded-xl object-contain"
                            />

                            {/* X icon inside the image */}
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Prev/Next inside lightbox */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 bg-white/60 hover:bg-white text-gray-900 p-2 rounded-full transition"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 bg-white/60 hover:bg-white text-gray-900 p-2 rounded-full transition"
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
