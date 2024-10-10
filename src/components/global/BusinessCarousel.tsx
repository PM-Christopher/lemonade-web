import React, {useEffect, useState} from 'react';
import Image, {StaticImageData} from "next/image";
import {CalendarIcon} from "lucide-react";
import DotIcon from "@/image/icons/Dot.svg";
import BusinessCard from "@/components/Dashboard/BusinessCard";

interface ImageSlider {
    images: StaticImageData[],
    showArrows: boolean,
    showDots: boolean
}

const BusinessCarousel: React.FC<ImageSlider> = ({images, showArrows, showDots}) => {
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
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-[12px]">
            <div className="grid grid-cols-4 gap-2 mt-3">
                <BusinessCard/>
                <BusinessCard/>
                <BusinessCard/>
                <BusinessCard/>
            </div>
        </div>
    );
}

export default BusinessCarousel;