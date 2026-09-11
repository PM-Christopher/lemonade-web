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
        <div className="border-2 border-mid-grey rounded-xl shadow-lg h-full flex flex-col">
            <div className="flex flex-col flex-1 p-[16px] gap-[20px]">
                {/* Top Section - Business Info */}
                <div className="">
                    <div className="flex justify-between">
                        <div className="flex flex-row laptop:flex-col items-center justify-center laptop:items-start gap-[8px] laptop:gap-[10px]">
                            <Image
                                src={business.image}
                                alt="Overlay Image"
                                className="border border-step-color rounded-xl w-[40px] h-[40px] object-cover"
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

                <div className="flex gap-2 flex-wrap items-center min-w-0 flex-1">
                    { business.services?.length > 0 && (
                        <>
                            <div className="py-0.5 px-2 bg-grey-20 rounded-xl flex-shrink-0">
                                <p className="font-semi-normal text-sm text-text-grey truncate">
                                    { business.services[0] }
                                </p>
                            </div>
                            { business.services.length > 1 && (
                                <div className="py-0.5 px-2 bg-grey-20 rounded-xl flex-shrink-0">
                                    <p className="font-semi-normal text-sm text-text-grey">
                                        {"+" + (business.services.length - 1)}
                                    </p>
                                </div>
                            ) }
                        </>
                    ) }

                    { /* ...existing service_rate code... */ }
                    { business.service_rate && (
                        <p className="font-semibold text-sm whitespace-nowrap flex-shrink-0">
                            {"N " + formatNumberWithCommas(business.service_rate) + "/hr"}
                        </p>
                    ) }
                </div>

            </div>
        </div>
    );
}

export default AllBusinessCard;