"use client"
import React from 'react';
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import {formatCountry} from "@/lib/formatCountry";
import {formatNumberWithCommas} from "@/lib/formatNumber";

type BusinessCardIF  = {
    business: BusinessInterface
}

const AllBusinessCard: React.FC<BusinessCardIF> = ({business}) => {
    return (
        <div className="border-[2px] border-mid-grey rounded-[12px] shadow-lg">
            <div className="flex flex-col">
                <div className="p-[16px]">
                    <div className="flex justify-between">
                        <div className="flex flex-row laptop:flex-col items-center justify-center laptop:items-start gap-[8px] laptop:gap-[10px]">
                            <Image
                                src={"/images/business_images/business_logo_1.png"}
                                alt="Overlay Image"
                                className="border border-step-color rounded-xl"
                                width={40}
                                height={40}
                            />
                            <div className="flex flex-col">
                                <p className="font-semi-normal text-[14px]">{business.name}</p>
                                <p className="font-normal text-[12px] text-text-grey">{business.city}, {formatCountry(business.country)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl h-fit">
                            <div>
                                <Image src={medal} alt="medal" width={16}/>
                            </div>
                            <div>
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                                    {business.rating}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-mid-grey p-[12px] px-[16px] rounded-bl-[12px] rounded-br-[12px]">
                    <div>
                        <div className="flex justify-between mt-[8px] items-center">
                            <div className="flex gap-2">
                                <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                    <p className="font-semi-normal text-[14px] text-text-grey">
                                        {business.services[0]}
                                    </p>
                                </div>
                                {
                                    business.services.length > 1 && (
                                        <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                            <p className="font-semi-normal text-[14px] text-text-grey">
                                                +{business.services.length - 1}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                business.service_rate ? (
                                    <p className="font-semibold text-[14px]">N {formatNumberWithCommas(business.service_rate)}/hr</p>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllBusinessCard;