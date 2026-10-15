import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import { formatCountry } from "@lemonade/domain";
import medal from "@/images/icons/medal.png";
import { formatNumber, formatNumberWithCommas } from "@/lib/formatNumber";

interface BusinessIF {
  business: BusinessInterface;
}

const FeaturedBusiness: React.FC<BusinessIF> = ({ business }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative w-full">
        {/* Use fill to take full card width */}
        <div className="relative h-32.5 w-full bg-gray-100 sm:h-35">
          <FallbackImage
            src={business?.image}
            fallbackSrc={images.BUSINESS_1}
            alt="Main Image"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Overlay avatar */}
        <div className="absolute -bottom-7 left-4">
          <div className="border-step-color h-14 w-14 overflow-hidden rounded-xl border bg-white shadow">
            <FallbackImage
              src={business?.image}
              fallbackSrc={images.BUSINESS_EMPTY}
              alt="Overlay Image"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-4 pt-10">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex min-w-0 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-light-black text-body-s truncate font-sans font-semibold">
                {business.name}
              </p>
              <DotIcon className="w-1 shrink-0" />
              <p className="text-light-black text-meta truncate font-sans leading-normal font-normal">
                {business.city}, {formatCountry(business.country)}
              </p>
            </div>
            <div className="bg-mid-grey flex items-center gap-1 self-start rounded-xl p-2 sm:self-center">
              <Image src={medal} alt="medal" width={16} height={16} />
              <p className="font-semi-normal text-primary-black text-body-s font-sans">
                {formatNumber(business.rating, 1)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {!!business.services?.[0] && (
              <div className="bg-grey-20 rounded-full p-2 px-3">
                <p className="font-semi-normal text-text-grey text-body-s font-sans">
                  {business.services[0]}
                </p>
              </div>
            )}

            {business.services?.length > 1 && (
              <div className="bg-grey-20 rounded-full p-2 px-3">
                <p className="font-semi-normal text-text-grey text-body-s font-sans">
                  +{business.services.length - 1}
                </p>
              </div>
            )}
          </div>

          <p className="text-body-l font-sans font-semibold whitespace-nowrap">
            ₦{formatNumberWithCommas(business.service_rate)}/hr
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBusiness;
