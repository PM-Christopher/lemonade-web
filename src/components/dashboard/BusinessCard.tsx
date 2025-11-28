import React from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import medal from "@/images/icons/medal.png"
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import {formatNumber, formatNumberWithCommas} from "@/lib/formatNumber";
import {formatCountry} from "@/lib/formatCountry";

type BusinessIF = {
    business: BusinessInterface
}

const BusinessCard: React.FC<BusinessIF> = ({business}) => {
    return (
        <>
            <div className="relative">
                <Image
                    src={business?.image}
                    alt="Main Image"
                    className="rounded-lg w-[319px] h-[105px]"
                    width={319}
                    height={105}
                />
                <div className="absolute bottom-[-35px] left-4 tablet:right-[260px] tablet:left-auto w-16 h-16">
                    <Image
                        src={business?.image}
                        alt="Overlay Image"
                        className="border border-step-color rounded-xl w-[56px] h-[56px]"
                        height={56}
                        width={56}
                    />
                </div>
            </div>

            <div className="p-[10px]">
                <div className="mt-10 flex flex-col sm:flex-row justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-semibold text-[14px] leading-[21px] text-light-black">
                            {business.name}
                        </p>
                        <DotIcon className="w-1"/>
                        <p className="font-sans font-normal text-[12px] text-light-black">
                            {business.city}, {formatCountry(business.country)}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl self-start sm:self-center">
                        <Image src={medal} alt="medal" width={16}/>
                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                            {formatNumber(business.rating, 1)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                    <div className="flex gap-2 items-center flex-wrap">
                        <div className="p-2 px-3 rounded-full bg-grey-20">
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                {business.services[0]}
                            </p>
                        </div>
                        {business.services.length > 1 && (
                            <div className="p-2 px-3 rounded-full bg-grey-20">
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                    +{business.services.length}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="font-sans font-semibold text-[16px] whitespace-nowrap">
                        ₦{formatNumberWithCommas(business.service_rate)}/hr
                    </p>
                </div>
            </div>
        </>
    );
}

export default BusinessCard;