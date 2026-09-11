import React from 'react';
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import {formatCountry} from "@/lib/formatCountry";
import medal from "@/images/icons/medal.png";
import {formatNumber, formatNumberWithCommas} from "@/lib/formatNumber";

interface BusinessIF {
    business: BusinessInterface
}

const FeaturedBusiness: React.FC<BusinessIF> = ({business}) => {
    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
            <div className="relative w-full">
                {/* Use fill to take full card width */}
                <div className="relative w-full h-[130px] sm:h-[140px] bg-gray-100">
                    <Image
                        src={business?.image}
                        alt="Main Image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                </div>

                {/* Overlay avatar */}
                <div className="absolute -bottom-7 left-4">
                    <div className="w-14 h-14 rounded-xl border border-step-color bg-white shadow overflow-hidden">
                        <Image
                            src={business?.image}
                            alt="Overlay Image"
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0 flex justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-sans font-semibold text-[14px] leading-[21px] text-light-black truncate">
                                {business.name}
                            </p>
                            <DotIcon className="w-1 shrink-0" />
                            <p className="font-sans font-normal text-[12px] text-light-black truncate">
                                {business.city}, {formatCountry(business.country)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl self-start sm:self-center">
                            <Image src={medal} alt="medal" width={16} height={16} />
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                                {formatNumber(business.rating, 1)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex gap-2 items-center flex-wrap">
                        {!!business.services?.[0] && (
                            <div className="p-2 px-3 rounded-full bg-grey-20">
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                    {business.services[0]}
                                </p>
                            </div>
                        )}

                        {business.services?.length > 1 && (
                            <div className="p-2 px-3 rounded-full bg-grey-20">
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                    +{business.services.length - 1}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="font-sans font-semibold text-[16px] whitespace-nowrap">
                        ₦{formatNumberWithCommas(business.service_rate)}/hr
                    </p>
                </div>
            </div>
        </div>

    );
};

export default FeaturedBusiness;