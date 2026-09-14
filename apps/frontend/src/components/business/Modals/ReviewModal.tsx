import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import RatingGreyIcon from "@/image/icons/RatingGreyIcon.png";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type ReviewInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const ReviewModal: React.FC<ReviewInterface> = ({ isOpen, toggleMenu }) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggleMenu}>
              <CloseIcon />
            </div>
            <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
              Write a review
            </p>
          </div>
          <div>
            <Button className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom">
              <p className="font-sans text-[12px] font-semi-normal">Submit a review</p>
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <div className="mt-[24px] grid gap-2">
            <Label
              htmlFor="fullname"
              className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
            >
              Business rating
            </Label>
            <div className="flex gap-2">
              <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
              <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
              <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
              <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
              <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
            </div>
          </div>
          <div className="mt-[24px] grid gap-2">
            <Label
              htmlFor="fullname"
              className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
            >
              Title
            </Label>
            <Input
              id="fullname"
              type="text"
              placeholder=""
              className="form-font h-12 rounded-xl border-0 bg-light_grey"
            />
          </div>
          <div className="mt-[24px] grid gap-2">
            <div className="flex justify-between">
              <Label
                htmlFor="fullname"
                className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
              >
                Description
              </Label>
              <p className="text-[12px] font-normal text-text-grey">100 characters</p>
            </div>
            <textarea
              id="fullname"
              placeholder="A short bio about yourself"
              className="h-[91px] resize-none rounded-xl border-0 bg-light_grey p-3 text-[14px] font-normal"
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
