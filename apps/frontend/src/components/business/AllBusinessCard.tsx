"use client";
import React from "react";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import { formatCountry } from "@/lib/formatCountry";
import { formatNumberWithCommas } from "@/lib/formatNumber";

type BusinessCardIF = {
  business: BusinessInterface;
};

const AllBusinessCard: React.FC<BusinessCardIF> = ({ business }) => {
  return (
    <div className="flex h-full flex-col rounded-xl border-2 border-mid-grey shadow-lg">
      <div className="flex flex-1 flex-col gap-[20px] p-[16px]">
        {/* Top Section - Business Info */}
        <div className="">
          <div className="flex justify-between">
            <div className="flex flex-row items-center justify-center gap-[8px] laptop:flex-col laptop:items-start laptop:gap-[10px]">
              <Image
                src={business.image}
                alt="Overlay Image"
                className="h-[40px] w-[40px] rounded-xl border border-step-color object-cover"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <p className="text-[14px] font-semi-normal">{business.name}</p>
                <p className="text-[12px] font-normal text-text-grey">
                  {business.city}, {formatCountry(business.country)}
                </p>
              </div>
            </div>
            <div className="flex h-fit items-center gap-1 rounded-xl bg-mid-grey p-2">
              <div>
                <Image src={medal} alt="medal" width={16} />
              </div>
              <div>
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-primary-black">
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
              <div className="flex-shrink-0 rounded-xl bg-grey-20 px-2 py-0.5">
                <p className="truncate text-sm font-semi-normal text-text-grey">
                  {business.services[0]}
                </p>
              </div>
              {business.services.length > 1 && (
                <div className="flex-shrink-0 rounded-xl bg-grey-20 px-2 py-0.5">
                  <p className="text-sm font-semi-normal text-text-grey">
                    {"+" + (business.services.length - 1)}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ...existing service_rate code... */}
          {business.service_rate && (
            <p className="flex-shrink-0 whitespace-nowrap text-sm font-semibold">
              {"N " + formatNumberWithCommas(business.service_rate) + "/hr"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBusinessCard;
