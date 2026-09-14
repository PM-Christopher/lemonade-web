import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/redux/hook";
import { changeReason } from "@/features/authentication/authSlice";
import {cancelReason} from "../../../../pageData";

interface ReasonSectionProps {
    toggle: (section: string) => void;
}

const ReasonSection = ({ toggle }: ReasonSectionProps) => {
    const dispatch = useAppDispatch();
    const [selectedReason, setSelectedReason] = useState<string>("");

    const handleChange = (value: string) => {
        setSelectedReason(value);
        dispatch(changeReason({reason: value}));
    };

    const handleContinue = () => {
        if (selectedReason) {
            toggle("cancel");
        } else {
            alert("Please select a reason to continue."); // optional UX feedback
        }
    };

    return (
        <div className="w-full laptop:w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-6">
            {/* Header */}
            <div>
                <p className="font-semibold text-[20px]">Why are you leaving?</p>
                <p className="font-normal text-[14px] text-light-black">
                    Tell us why you canceled your plan and we&apos;ll do our best to improve
                </p>
            </div>

            {/* Radio Options */}
            <RadioGroup value={selectedReason} onValueChange={handleChange}>
                <div className="flex flex-col gap-[20px]">
                    {cancelReason.map(({ value, label }) => (
                        <div
                            key={value}
                            className={`flex items-center gap-2 border-2 rounded-[12px] p-[12px] px-[16px] cursor-pointer ${
                                selectedReason === value ? "border-step-color bg-gray-50" : "border-grey-20"
                            }`}
                        >
                            <RadioGroupItem value={value} id={value} />
                            <Label htmlFor={value} className="font-normal text-[16px] text-black-light">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </RadioGroup>

            {/* Continue Button */}
            <div className="flex justify-end mt-[24px]">
                <Button
                    className="bg-white hover:bg-white shadow-none h-[48px] border-1 rounded-[12px] px-6"
                    onClick={handleContinue}
                >
                    <p className="font-medium text-[16px] text-black-light">Continue</p>
                </Button>
            </div>
        </div>
    );
};

export default ReasonSection;
