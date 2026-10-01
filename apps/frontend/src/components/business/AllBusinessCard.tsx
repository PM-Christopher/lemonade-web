"use client";
import React from "react";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { formatCountry } from "@lemonade/domain";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { getSafeImageSrc } from "@/lib/helper";

type BusinessCardIF = {
  business: BusinessInterface;
};

const AllBusinessCard: React.FC<BusinessCardIF> = ({ business }) => {
  return (
    <div className="border-mid-grey flex h-full flex-col rounded-xl border-2 shadow-lg">
      <div className="flex flex-1 flex-col gap-[20px] p-[16px]">
        {/* Top Section - Business Info */}
        <div className="">
          <div className="flex justify-between">
            <div className="laptop:flex-col laptop:items-start laptop:gap-[10px] flex flex-row items-center justify-center gap-[8px]">
              <Image
                src={getSafeImageSrc(business.image, "/images/business_empty.png")}
                alt="Overlay Image"
                className="border-step-color h-[40px] w-[40px] rounded-xl border object-cover"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <p className="font-semi-normal text-[14px]">{business.name}</p>
                <p className="text-text-grey text-[12px] font-normal">
                  {business.city}, {formatCountry(business.country)}
                </p>
              </div>
            </div>
            <div className="bg-mid-grey flex h-fit items-center gap-1 rounded-xl p-2">
              <div>
                <Image src={medal} alt="medal" width={16} />
              </div>
              <div>
                <p className="font-semi-normal text-primary-black font-sans text-[14px] leading-[21px]">
                  {business.rating}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Services and Price */}
        {/*<div className="bg-mid-grey p-3 px-4 rounded-bl-xl rounded-br-xl mt-auto">*/}
        {/*    <div className="flex justify-between items-center gap-2">*/}
        {/*        <div className="flex gap-2 flex-wrap items-center min-w-0 flex-1">*/}
        {/*            <div className="py-0.5 px-2 bg-grey-20 rounded-xl flex-shrink-0">*/}
        {/*                <p className="font-semi-normal text-sm text-text-grey truncate">*/}
        {/*                    {business.services[0]}*/}
        {/*                </p>*/}
        {/*            </div>*/}
        {/*            {business.services.length > 1 && (*/}
        {/*                <div className="py-0.5 px-2 bg-grey-20 rounded-xl flex-shrink-0">*/}
        {/*                    <p className="font-semi-normal text-sm text-text-grey">*/}
        {/*                        +{business.services.length - 1}*/}
        {/*                    </p>*/}
        {/*                </div>*/}
        {/*            )}*/}
        {/*        </div>*/}
        {/*        {business.service_rate && (*/}
        {/*            <p className="font-semibold text-sm whitespace-nowrap flex-shrink-0">*/}
        {/*                N {formatNumberWithCommas(business.service_rate)}/hr*/}
        {/*            </p>*/}
        {/*        )}*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {business.services?.length > 0 && (
            <>
              <div className="bg-grey-20 flex-shrink-0 rounded-xl px-2 py-0.5">
                <p className="font-semi-normal text-text-grey truncate text-sm">
                  {business.services[0]}
                </p>
              </div>
              {business.services.length > 1 && (
                <div className="bg-grey-20 flex-shrink-0 rounded-xl px-2 py-0.5">
                  <p className="font-semi-normal text-text-grey text-sm">
                    {"+" + (business.services.length - 1)}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ...existing service_rate code... */}
          {business.service_rate && (
            <p className="flex-shrink-0 text-sm font-semibold whitespace-nowrap">
              {"N " + formatNumberWithCommas(business.service_rate) + "/hr"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBusinessCard;
