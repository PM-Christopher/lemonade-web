import React from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import medal from "@/images/icons/medal.png";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { formatNumber, formatNumberWithCommas } from "@/lib/formatNumber";
import { formatCountry } from "@lemonade/domain";
import { getSafeImageSrc } from "@/lib/helper";

type BusinessIF = {
  business: BusinessInterface;
};

const BusinessCard: React.FC<BusinessIF> = ({ business }) => {
  return (
    <>
      <div className="relative">
        <Image
          src={getSafeImageSrc(business?.image, "/images/business_images/business_1.png")}
          alt="Main Image"
          className="h-[105px] w-full rounded-lg object-cover"
          width={320}
          height={105}
        />
        <div className="absolute -bottom-7 left-4 h-14 w-14">
          <Image
            src={getSafeImageSrc(business?.image, "/images/business_empty.png")}
            alt="Overlay Image"
            className="border-step-color h-14 w-14 rounded-xl border object-cover"
            height={56}
            width={56}
          />
        </div>
      </div>

      <div className="px-2.5 pt-10 pb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="text-light-black text-body-s truncate font-sans font-semibold">
              {business.name}
            </p>
            <DotIcon className="w-1 shrink-0" />
            <p className="text-light-black text-meta truncate font-sans font-normal">
              {business.city}, {formatCountry(business.country)}
            </p>
          </div>

          <div className="bg-mid-grey flex shrink-0 items-center gap-1 rounded-xl p-2">
            <Image src={medal} alt="medal" width={16} />
            <p className="font-semi-normal text-primary-black text-body-s font-sans">
              {formatNumber(business.rating, 1)}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="bg-grey-20 max-w-full rounded-full p-2 px-3">
              <p className="font-semi-normal text-text-grey text-label truncate font-sans">
                {business.services[0]}
              </p>
            </div>
            {business.services.length > 1 && (
              <div className="bg-grey-20 shrink-0 rounded-full p-2 px-3">
                <p className="font-semi-normal text-text-grey text-label font-sans">
                  +{business.services.length}
                </p>
              </div>
            )}
          </div>

          <p className="text-body-l shrink-0 font-sans font-semibold whitespace-nowrap">
            ₦{formatNumberWithCommas(business.service_rate)}/hr
          </p>
        </div>
      </div>
    </>
  );
};

export default BusinessCard;
