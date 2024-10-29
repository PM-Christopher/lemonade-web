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
        <div className="max-w-md rounded-lg bg-white">
            <div className="relative">
                <Image
                    src={"/images/business_images/business_1.png"}
                    alt="Main Image"
                    className="rounded-lg"
                    width={319}
                    height={105}
                />
                <div className="absolute bottom-[-35px] right-[240px] w-16 h-16">
                    <Image
                        src={"/images/business_images/business_logo_1.png"}
                        alt="Overlay Image"
                        className="border border-step-color rounded-xl"
                        height={56}
                        width={56}
                    />
                </div>
            </div>
            <div className="p-[10px]">
                <div className="mt-10 flex justify-between">
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="font-sans font-semibold text-[14px] leading-[21px] text-light-black">
                                {business.name}
                            </p>
                        </div>
                        <div>
                            <DotIcon className="w-1"/>
                        </div>
                        <div className="font-sans font-normal text-[12px] text-light-black">
                            {business.city}, {formatCountry(business.country)}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl">
                        <div>
                            <Image src={medal} alt="medal" width={16}/>
                        </div>
                        <div>
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                                {formatNumber(business.rating, 1)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2 items-center">
                        <div className="p-2 px-3 rounded-full bg-grey-20">
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                {business.services[0]}
                            </p>
                        </div>
                        {
                            business.services.length > 1 && (
                                <div className="p-2 px-3 rounded-full bg-grey-20">
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                                        +{business.services.length}
                                    </p>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <p className="font-sans font-semibold text-[16px]">₦{formatNumberWithCommas(business.service_rate)}/hr</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;