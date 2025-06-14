import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

function ImageCarousel({images}: {images: any}) {
    const [current, setCurrent] = useState(0);
    const totalImages = images.length;

    const prevSlide = () => {
        setCurrent(current === 0 ? totalImages - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === totalImages - 1 ? 0 : current + 1);
    };
    return (
        <div className="relative w-full max-w-[736px] mx-auto overflow-hidden rounded-xl mt-4">
            <div className="relative h-[350px]">
                <Image
                    src={images[current]}
                    alt={`slide-${current}`}
                    fill
                    className="object-cover transition-all duration-500 rounded-xl"
                    sizes="(max-width: 768px) 100vw, 600px"
                />
            </div>

            {/* Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-60 p-2 rounded-full shadow hover:bg-opacity-100"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-60 p-2 rounded-full shadow hover:bg-opacity-100"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2">
                {images.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-[10px] h-[10px] rounded-full ${
                            index === current ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImageCarousel;