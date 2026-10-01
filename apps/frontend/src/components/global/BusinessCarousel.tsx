import React, { useCallback, useEffect, useState } from "react";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import FeaturedBusiness from "@/components/business/FeaturedBusiness";

interface ImageSlider {
  businesses: BusinessInterface[];
  showArrows: boolean;
  showDots: boolean;
}

const BusinessCarousel: React.FC<ImageSlider> = ({ businesses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === businesses?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, businesses?.length]);

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(slideInterval); // Clean up on unmount
  }, [nextSlide]);

  return (
    <div className="w-full">
      <div className="mt-3 grid grid-cols-4 gap-3">
        {businesses?.map((business: BusinessInterface) => (
          <FeaturedBusiness business={business} key={business.id} />
        ))}
      </div>
    </div>
  );
};

export default BusinessCarousel;
