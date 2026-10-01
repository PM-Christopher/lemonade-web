import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import Image from "next/image";

type ReviewInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const ReviewModal: React.FC<ReviewInterface> = ({ isOpen, toggleMenu }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Write a review"}</DialogTitle>
        <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggleMenu}>
                <CloseIcon />
              </div>
              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                Write a review
              </p>
            </div>
            <div>
              <Button className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5">
                <p className="font-semi-normal font-sans text-[12px]">Submit a review</p>
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <div className="mt-6 grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
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
            <div className="mt-6 grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
              >
                Title
              </Label>
              <Input
                id="fullname"
                type="text"
                placeholder=""
                className="form-font bg-light_grey h-12 rounded-xl border-0"
              />
            </div>
            <div className="mt-6 grid gap-2">
              <div className="flex justify-between">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Description
                </Label>
                <p className="text-text-grey text-[12px] font-normal">100 characters</p>
              </div>
              <textarea
                id="fullname"
                placeholder="A short bio about yourself"
                className="bg-light_grey h-[91px] resize-none rounded-xl border-0 p-3 text-[14px] font-normal"
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ReviewModal;
