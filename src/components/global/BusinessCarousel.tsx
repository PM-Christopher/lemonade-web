import React, {useEffect, useState} from 'react';
import BusinessCard from "@/components/dashboard/BusinessCard";
import {BusinessInterface} from "@/interfaces/BusinessInterface";

interface ImageSlider {
    businesses: BusinessInterface[],
    showArrows: boolean,
    showDots: boolean
}

const BusinessCarousel: React.FC<ImageSlider> = ({businesses, showArrows, showDots}) => {
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
        const newIndex = isFirstSlide ? businesses.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === businesses.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-[12px]">
            <div className="grid grid-cols-4 gap-2 mt-3">
                {
                    businesses.map((business: BusinessInterface, index: number) => (
                        <BusinessCard business={business} key={index}/>
                    ))
                }
            </div>
        </div>
    );
}

export default BusinessCarousel;