import React from 'react';
import Image from "next/image";
import business_banner from "@/image/business_images/business_1.png"
import business_logo from "@/image/business_images/business_logo_1.png"
import DotIcon from "@/image/icons/Dot.svg";
import medal from "@/image/icons/medal.png"

function BusinessCard() {
    return (
        <div className="max-w-md rounded-lg">
            <div className="relative">
                <Image
                    src={business_banner}
                    alt="Main Image"
                    className="rounded-lg"
                />
                <div className="absolute bottom-[-35px] right-[195px] w-16 h-16">
                    <Image
                        src={business_logo}
                        alt="Overlay Image"
                        className="border border-step-color rounded-xl"
                    />
                </div>
            </div>
            <div className="mt-10 flex justify-between">
                <div className="flex items-center gap-2">
                    <div>
                        <p className="font-sans font-semibold text-[14px] leading-[21px] text-light-black">
                            Product designer
                        </p>
                    </div>
                    <div>
                        <DotIcon/>
                    </div>
                    <div className="font-sans font-normal text-[12px] text-light-black">
                        Lagos, NG
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl">
                    <div>
                        <Image src={medal} alt="medal" width={16} />
                    </div>
                    <div>
                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">4.5</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2 items-center">
                    <div className="p-2 px-3 rounded-full bg-grey-20">
                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">UI designs</p>
                    </div>
                    <div className="p-2 px-3 rounded-full bg-grey-20">
                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">+3</p>
                    </div>
                </div>
                <div>
                    <p className="font-sans font-semibold text-[16px]">₦2,000/hr</p>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;