"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import StrikeLine from "@/images/icons/strikeLine.svg";
import CopyIcon from "@/images/icons/copyIcon.svg";
import MainLayout from "@/components/layouts/MainLayout";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRouter } from "next/navigation";

const ProgramDetailsPage = () => {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter()

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Copied to clipboard",
          type: "success",
        })
      );
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Program details
            </p>
          </div>
        </div>

        <section className="mt-4 flex flex-col items-center">
          <div className="flex flex-col laptop:flex-row laptop:justify-between laptop:gap-[40px]">
            <div className="w-full laptop:w-[640px] rounded-[12px] gap-[24px] bg-none laptop:bg-white">
              <div className="p-0 laptop:p-[24px]">
                <div className="w-screen laptop:w-full bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                  <Image
                    src={"/images/event_images/details_image.png"}
                    alt="details"
                    width={120}
                    height={120}
                  />
                  <div className="flex flex-col">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      Halloween party
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        Mon, 23 Mar
                      </p>
                      <DotIcon className="w-1" />
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        4PM
                      </p>
                      <p className="font-sans text-text-grey">-</p>
                      <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">
                        6PM
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <p className="font-sans font-normal text-[16px] leading-[27px] text-text-grey">
                        Lekki phase 1
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-[24px]">
                <div className="p-[16px] rounded-[12px] gap-[16px] bg-light-tint mt-[24px] mb-[28px]">
                  <p className="font-semi-normal text-text-grey text-[14px]">
                    Affiliate link
                  </p>
                  <div className="p-[12px] rounded-[12px] gap-[8px] bg-light-tint-3 mt-[8px] flex items-center">
                    <p className="w-[251px] laptop:w-[500px] font-semi-normal text-light-black truncate">{`${process.env.NEXT_PUBLIC_APP_URL}/event/5/123432`}</p>
                    <StrikeLine />
                    <CopyIcon
                      className="w-[20px] h-[20px] cursor-pointer"
                      onClick={() =>
                        handleCopy(
                          `${process.env.NEXT_PUBLIC_APP_URL}/event/5/123432`
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col p-[16px] rounded-[12px] border-[1px] border-mid-grey bg-white laptop:bg-none shadow-sm laptop:shadow-none">
                  <p className="font-sans font-normal text-text-grey text-[14px]">
                    Total commission
                  </p>
                  <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                    N22,000
                  </p>
                  <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                  <p className="font-sans font-normal text-text-grey text-[14px]">
                    Tickets sold
                  </p>
                  <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                    300
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full laptop:w-[480px] bg-none laptop:bg-white p-[16px] rounded-[8px] flex flex-col gap-4">
              <div className="bg-white laptop:bg-none p-[16px] rounded-[8px]">
                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                  Commissions by ticket type
                </p>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    Free
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      N0
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      40/∞
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    Regular
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      N2,000
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      160/2000
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    VIP
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      N20,000
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      100/500
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white laptop:bg-none p-[16px] rounded-[8px]">
                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                  Tickets sold by ticket type
                </p>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    Free
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      -
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      40/∞
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    Regular
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      10%
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      160/2000
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                <div>
                  <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">
                    VIP
                  </p>
                  <div className="flex justify-between mt-[2px]">
                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                      20%
                    </p>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                      100/500
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                    <div
                      className="bg-gradient-progress-green h-[8px] rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default ProgramDetailsPage;
