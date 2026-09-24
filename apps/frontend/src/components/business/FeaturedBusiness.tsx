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
        <div className="sm:h-[140px] relative h-[130px] w-full bg-gray-100">
          <Image
            src={business?.image || "/images/business_empty.png"}
            alt="Main Image"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Overlay avatar */}
        <div className="absolute -bottom-7 left-4">
          <div className="h-14 w-14 overflow-hidden rounded-xl border border-step-color bg-white shadow">
            <Image
              src={business?.image || "/images/business_empty.png"}
              alt="Overlay Image"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-4 pt-10">
        <div className="sm:flex-row sm:items-center flex flex-col justify-between gap-2">
          <div className="flex min-w-0 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-sans text-[14px] font-semibold leading-[21px] text-light-black">
                {business.name}
              </p>
              <DotIcon className="w-1 shrink-0" />
              <p className="truncate font-sans text-[12px] font-normal text-light-black">
                {business.city}, {formatCountry(business.country)}
              </p>
            </div>
            <div className="sm:self-center flex items-center gap-1 self-start rounded-xl bg-mid-grey p-2">
              <Image src={medal} alt="medal" width={16} height={16} />
              <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-primary-black">
                {formatNumber(business.rating, 1)}
              </p>
            </div>
          </div>
        </div>

        <div className="sm:flex-row sm:items-center mt-3 flex flex-col items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {!!business.services?.[0] && (
              <div className="rounded-full bg-grey-20 p-2 px-3">
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-text-grey">
                  {business.services[0]}
                </p>
              </div>
            )}

            {business.services?.length > 1 && (
              <div className="rounded-full bg-grey-20 p-2 px-3">
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-text-grey">
                  +{business.services.length - 1}
                </p>
              </div>
            )}
          </div>

          <p className="whitespace-nowrap font-sans text-[16px] font-semibold">
            ₦{formatNumberWithCommas(business.service_rate)}/hr
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBusiness;
