"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { formatCountry } from "@lemonade/domain";
import { formatMinorNaira } from "@/lib/formatNumber";
import { formatDecimal } from "@/lib/helper";

type BusinessCardIF = {
  business: BusinessInterface;
};

const AllBusinessCard: React.FC<BusinessCardIF> = ({ business }) => {
  return (
    <div className="border-mid-grey flex h-full flex-col rounded-xl border-2 shadow-lg">
      <div className="flex flex-1 flex-col gap-5 p-4">
        {/* Top Section - Business Info */}
        <div className="">
          <div className="flex justify-between">
            <div className="laptop:flex-col laptop:items-start laptop:gap-2.5 flex flex-row items-center justify-center gap-2">
              <FallbackImage
                src={business.image}
                fallbackSrc={images.BUSINESS_EMPTY}
                alt="Overlay Image"
                className="border-step-color h-10 w-10 rounded-xl border object-cover"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <p className="font-semi-normal text-body-s">{business.name}</p>
                <p className="text-text-grey text-meta leading-normal font-normal">
                  {business.city}, {formatCountry(business.country)}
                </p>
              </div>
            </div>
            <div className="bg-mid-grey flex h-fit items-center gap-1 rounded-xl p-2">
              <div>
                <Image src={medal} alt="medal" width={16} />
              </div>
              <div>
                <p className="font-semi-normal text-primary-black text-body-s font-sans">
                  {formatDecimal(business.rating ?? 0, 1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: services and hourly rate; left out when the business has neither. */}
      {(business.services?.length > 0 || business.service_rate > 0) && (
        <div className="bg-mid-grey mt-auto flex items-center justify-between gap-2 rounded-b-xl p-3 px-4">
          {business.services?.length > 0 && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="bg-grey-20 max-w-full rounded-xl px-2 py-0.5">
                <p className="font-semi-normal text-text-grey truncate text-sm">
                  {business.services[0]}
                </p>
              </div>
              {business.services.length > 1 && (
                <div className="bg-grey-20 shrink-0 rounded-xl px-2 py-0.5">
                  <p className="font-semi-normal text-text-grey text-sm">
                    +{business.services.length - 1}
                  </p>
                </div>
              )}
            </div>
          )}
          {business.service_rate > 0 && (
            <p className="ml-auto shrink-0 text-sm font-semibold whitespace-nowrap">
              {formatMinorNaira(business.service_rate)}/hr
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllBusinessCard;
