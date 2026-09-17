import React, { useState } from "react";
import { Button, Label } from "@lemonade/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch } from "@/redux/hook";
import { changeReason } from "@/features/authentication/authSlice";
import { cancelReason } from "../../../../pageData";

interface ReasonSectionProps {
  toggle: (section: string) => void;
}

const ReasonSection = ({ toggle }: ReasonSectionProps) => {
  const dispatch = useAppDispatch();
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedReason(value);
    dispatch(changeReason({ reason: value }));
  };

  const handleContinue = () => {
    if (selectedReason) {
      toggle("cancel");
    } else {
      alert("Please select a reason to continue."); // optional UX feedback
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-[12px] bg-white p-[24px] laptop:w-[640px]">
      {/* Header */}
      <div>
        <p className="text-[20px] font-semibold">Why are you leaving?</p>
        <p className="text-[14px] font-normal text-light-black">
          Tell us why you canceled your plan and we&apos;ll do our best to improve
        </p>
      </div>

      {/* Radio Options */}
      <RadioGroup value={selectedReason} onValueChange={handleChange}>
        <div className="flex flex-col gap-[20px]">
          {cancelReason.map(({ value, label }) => (
            <div
              key={value}
              className={`flex cursor-pointer items-center gap-2 rounded-[12px] border-2 p-[12px] px-[16px] ${
                selectedReason === value ? "border-step-color bg-gray-50" : "border-grey-20"
              }`}
            >
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="text-[16px] font-normal text-black-light">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {/* Continue Button */}
      <div className="mt-[24px] flex justify-end">
        <Button
          className="border-1 h-[48px] rounded-[12px] bg-white px-6 shadow-none hover:bg-white"
          onClick={handleContinue}
        >
          <p className="text-[16px] font-medium text-black-light">Continue</p>
        </Button>
      </div>
    </div>
  );
};

export default ReasonSection;
