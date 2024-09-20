import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const MultipleTicketCard: React.FC = () => {
    return (
        <div className="mt-[24px] bg-grey-20 p-[16px] rounded-[12px] gap-[16px]">
            <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-black-light">Ticket
                1 - Regular</p>
            <div className="grid gap-2 mt-[24px]">
                <Label htmlFor="fullname"
                       className="text-text-grey font-sans font-normal text-[14px] leading-[16.8px]">Full
                    name</Label>
                <Input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Jano doe"
                    className="h-12 rounded-xl bg-light_grey form-font border-0 shadow-none"
                />
            </div>
            <div className="grid gap-2 mt-[16px]">
                <Label htmlFor="email" className="text-text-grey font-sans font-normal text-[14px] leading-[16.8px]">Email
                    address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janodoe@email.com"
                    className="h-12 rounded-xl bg-light_grey form-font border-0 shadow-none"
                />
            </div>
            <div
                className="flex justify-between items-center bg-light_grey rounded-[12px] py-[10px] px-[12px] mt-[16px]">
                <div>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Ticket
                        quantity</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div
                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                        <p className="">-</p>
                    </div>
                    <div
                        className="p-4 rounded-[8px] bg-mid-grey w-[27.75px] h-[28px] flex items-center justify-center">
                        <p className="text-[16px] font-sans font-semi-normal leading-[24px] tracking-custom">1</p>
                    </div>
                    <div
                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                        <p className="">+</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MultipleTicketCard;