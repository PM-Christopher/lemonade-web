import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import RatingGreyIcon from "@/image/icons/RatingGreyIcon.png";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Image from "next/image";

type ReviewInterface = {
    isOpen: boolean,
    toggleMenu: () => void
}

const ReviewModal: React.FC<ReviewInterface> = ({isOpen, toggleMenu}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Write a review</p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom">
                            <p className="font-sans font-semi-normal text-[12px]">Submit a review</p>
                        </Button>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business rating</Label>
                        <div className="flex gap-2">
                            <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
                            <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
                            <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
                            <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
                            <Image src={"/image/RatingGreyIcon.png"} alt="rating" width={29} height={29} />
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Title</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <div className="flex justify-between">
                            <Label htmlFor="fullname"
                                   className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Description</Label>
                            <p className="font-normal text-[12px] text-text-grey">100 characters</p>
                        </div>
                        <textarea
                            id="fullname"
                            placeholder="A short bio about yourself"
                            className="h-[91px] p-3 rounded-xl bg-light_grey font-normal text-[14px] border-0 resize-none"
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;