import React, {useEffect, useState} from 'react';
import BusinessCard from "@/components/dashboard/BusinessCard";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import FeaturedBusiness from "@/components/business/FeaturedBusiness";

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
        const newIndex = isFirstSlide ? businesses?.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === businesses?.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="w-full">
            <div className="mt-3 grid gap-3 grid-cols-4">
                {businesses?.map((business: BusinessInterface) => (
                    <FeaturedBusiness business={business} key={business.id} />
                ))}
            </div>
        </div>
    );
}

export default BusinessCarousel;