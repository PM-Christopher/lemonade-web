import React from 'react';
import business_logo from "@/image/business_images/business_logo_1.png";
import Image from "next/image";
import medal from "@/image/icons/medal.png";

const AllBusinessCard = ({}) => {
    return (
        <div className="border-[2px] border-mid-grey rounded-[12px] shadow-lg">
            <div className="flex flex-col">
                <div className="p-[16px]">
                    <div className="flex justify-between">
                        <Image
                            src={business_logo}
                            alt="Overlay Image"
                            className="border border-step-color rounded-xl"
                            width={40}
                        />
                        <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl">
                            <div>
                                <Image src={medal} alt="medal" width={16}/>
                            </div>
                            <div>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">4.5</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-[8px]">
                        <p className="font-semi-normal text-[14px]">Product designer</p>
                        <p className="font-normal text-[12px] text-text-grey">Lagos, NG</p>
                    </div>
                </div>
                <div className="bg-mid-grey p-[12px] px-[16px] rounded-bl-[12px] rounded-br-[12px]">
                    <div>
                        <div className="flex justify-between mt-[8px] items-center">
                            <div className="flex gap-2">
                                <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                    <p className="font-semi-normal text-[14px] text-text-grey">UI designs</p>
                                </div>
                                <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                    <p className="font-semi-normal text-[14px] text-text-grey">+3</p>
                                </div>
                            </div>
                            <p className="font-semibold text-[14px]">N2,000/hr</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllBusinessCard;