import React from "react";
import Link from "next/link";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import FeaturedBusiness from "@/components/business/FeaturedBusiness";
import { routes } from "@/lib/routes";

interface FeaturedBusinessesProps {
  businesses: BusinessInterface[];
}

// Featured businesses; each card opens its details page.
const BusinessCarousel: React.FC<FeaturedBusinessesProps> = ({ businesses }) => {
  return (
    <div className="w-full">
      <div className="mt-3 grid grid-cols-4 gap-3">
        {businesses?.map((business: BusinessInterface) => (
          <Link href={routes.BUSINESS_DETAIL(business.id)} key={business.id}>
            <FeaturedBusiness business={business} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessCarousel;
