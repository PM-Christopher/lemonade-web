import React from "react";
import Image from "next/image";
import RocketGreenIcon from "@/icons/rocketIconGreen.svg";

const BusinessView = ({ userDetail }: any) => {
  return (
    <div className="flex flex-col gap-[24px] p-[24px]">
      <div
        className="relative w-full rounded-[12px] bg-white bg-cover bg-center bg-no-repeat p-[16px]"
        style={{ backgroundImage: `url('/images/business-bg.png')` }}
      >
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Image
              src={"/images/business/jobLogo.png"}
              alt="logo"
              className="rounded-[16px] border-[1px] border-step-color"
              width={64}
              height={64}
            />
          </div>
          <div className="mt-[8px] flex flex-col justify-center">
            <p className="text-center text-[16px] font-semibold">{"data?.business?.name"}</p>
            <p className="text-center text-[14px] font-medium text-text-grey">
              {"data?.business?.city"}, {"data?.business?.country"}
            </p>
          </div>
          <div className="mt-[8px] flex justify-center">
            <div className="flex items-center gap-1 rounded-xl bg-mid-grey p-2">
              <Image src={"/images/medal.png"} alt="medal" width={16} height={16} />
              <p className="font-sans text-[14px] font-medium text-primary-black">
                {/* rating value */}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 rounded-bl-[12px] rounded-tr-[12px] bg-light-green-10">
          <div className="flex items-center gap-[4px] p-[4px] px-[8px]">
            <RocketGreenIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <p className="text-[14px] font-medium text-mid-green">Boosted</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex h-96 flex-col">
        {/* The flex-1 and min-h-0 classes ensure that this div will shrink properly within the parent */}
        <div className="hide-scrollbar flex min-h-0 flex-col gap-[12px] overflow-y-auto">
          <div className="flex flex-col gap-[12px] border-b-[1px] pb-[24px]">
            <p className="text-[16px] font-bold">About business</p>
            <p className="text-[14px] font-normal text-light-black">
              We don&apos;t just design products, we build brands. We&apos;re a creative agency that
              takes your vision from initial concept to market success. By working with us, you
              benefit from a seamless experience where every step is reinforced.
            </p>
          </div>
          <div className="flex flex-col gap-[12px] border-b-[1px] pb-[24px]">
            <p className="text-[16px] font-bold">Business categories</p>
            <p className="text-[14px] font-normal text-light-black">
              Software development, Digital design
            </p>
          </div>
          <div className="flex flex-col gap-[12px] border-b-[1px] pb-[24px]">
            <p className="text-[16px] font-bold">Services</p>
            <p className="text-[14px] font-normal text-light-black">
              UI designs, Mock ups designs, Graphic designs
            </p>
          </div>
          <div className="flex flex-col gap-[12px] border-b-[1px] pb-[24px]">
            <p className="text-[16px] font-bold">Portfolio Gallery</p>
            <div className="flex flex-wrap gap-1">
              {/*{*/}
              {/*    data?.business?.gallery?.map((item: string, index: string) => (*/}
              <Image
                src={"/images/tribe_1.png"}
                alt="image_1"
                className="rounded-[4px]"
                width={170.5}
                height={170.5}
              />
              {/*    ))*/}
              {/*}*/}
            </div>
          </div>
          <div className="flex flex-col gap-[12px] border-b-[1px] pb-[24px]">
            <p className="text-[16px] font-bold">Reviews</p>
            <p className="text-[14px] font-normal text-light-black">
              UI designs, Mock ups designs, Graphic designs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessView;
