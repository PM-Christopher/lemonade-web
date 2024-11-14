import React from 'react';
import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

const ReasonSection = ({}) => {
    return (
        <div className="w-full laptop:w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-4">
            <div>
                <p className="font-semibold text-[20px]">Why are you leaving?</p>
                <p className="font-normal text-[14px] text-light-black">Tell us why you canceled your plan and we'll do out best to fix it</p>
            </div>
            <div className="flex flex-col">
                <RadioGroup defaultValue="option-one">
                    <div className="flex-col flex gap-[20px]">
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-one" id="option-one"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">I don't need the benefits anymore</Label>
                        </div>
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-two" id="option-two"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">I'm not getting value for money</Label>
                        </div>
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-three" id="option-three"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">I'm unhappy with customer support</Label>
                        </div>
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-four" id="option-four"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">I subscribed by accident</Label>
                        </div>
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-five" id="option-five"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">Premium is out of my pricing range</Label>
                        </div>
                        <div
                            className="flex items-center space-x-2 border-[2px] rounded-[12px] border-grey-20 p-[12px] px-[16px]">
                            <RadioGroupItem value="option-six" id="option-six"/>
                            <Label className="font-normal text-[16px] text-black-light font-sans" htmlFor="option-one">Other</Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>
            <div className="flex justify-between gap-[16px] mt-[24px]">
                <Button className="bg-white hover:bg-white shadow-none h-[48px] border-[1px] rounded-[12px] w-full">
                    <p className="font-semi-normal text-[16px] text-black-light">Continue</p>
                </Button>
            </div>
        </div>
    );
}

export default ReasonSection;