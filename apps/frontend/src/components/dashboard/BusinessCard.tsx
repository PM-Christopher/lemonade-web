import React from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import medal from "@/images/icons/medal.png";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { formatNumber, formatNumberWithCommas } from "@/lib/formatNumber";
import { formatCountry } from "@/lib/formatCountry";

type BusinessIF = {
  business: BusinessInterface;
};

const BusinessCard: React.FC<BusinessIF> = ({ business }) => {
  return (
    <>
      <div className="relative">
        <Image
          src={business?.image}
          alt="Main Image"
          className="h-[105px] w-[319px] rounded-lg"
          width={319}
          height={105}
        />
        <div className="absolute bottom-[-35px] left-4 h-16 w-16 tablet:left-auto tablet:right-[260px]">
          <Image
            src={business?.image}
            alt="Overlay Image"
            className="h-[56px] w-[56px] rounded-xl border border-step-color"
            height={56}
            width={56}
          />
        </div>
      </div>

      <div className="p-[10px]">
        <div className="sm:flex-row mt-10 flex flex-col justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-[14px] font-semibold leading-[21px] text-light-black">
              {business.name}
            </p>
            <DotIcon className="w-1" />
            <p className="font-sans text-[12px] font-normal text-light-black">
              {business.city}, {formatCountry(business.country)}
            </p>
          </div>

          <div className="sm:self-center flex items-center gap-1 self-start rounded-xl bg-mid-grey p-2">
            <Image src={medal} alt="medal" width={16} />
            <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-primary-black">
              {formatNumber(business.rating, 1)}
            </p>
          </div>
        </div>

        <div className="sm:flex-row sm:items-center mt-2 flex flex-col items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-grey-20 p-2 px-3">
              <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-text-grey">
                {business.services[0]}
              </p>
            </div>
            {business.services.length > 1 && (
              <div className="rounded-full bg-grey-20 p-2 px-3">
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-text-grey">
                  +{business.services.length}
                </p>
              </div>
            )}
          </div>

          <p className="whitespace-nowrap font-sans text-[16px] font-semibold">
            ₦{formatNumberWithCommas(business.service_rate)}/hr
          </p>
        </div>
      </div>
    </>
  );
};

export default BusinessCard;
