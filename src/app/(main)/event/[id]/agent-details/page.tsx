"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import AttachmentIcon from "@/images/icons/attachments.svg";
import { Button } from "@/components/ui/button";
import AffiliateLinkModal from "@/components/events/Modals/AffiliateLinkModal";
import MainLayout from "@/components/layouts/MainLayout";

const AgentDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MainLayout>
      <section className="bg-white laptop:bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
          <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
            <ChevronLeft />
            <p className="font-semibold text-[16px] tracking-custom">
              Event details
            </p>
          </div>
        </div>
        <section className="mt-0 laptop:mt-4 flex flex-col items-center">
          <div className="flex justify-center">
            <div className="flex flex-col laptop:flex-row w-full laptop:w-[1312px] bg-white rounded-[16px] laptop:items-center gap-[48px] p-0 laptop:p-[4px]">
              <Image
                src={"/images/event_images/event_details.png"}
                alt="event details"
                width={496}
                height={532}
                className="w-screen h-[440px] laptop:w-[496px] laptop:h-[532px]"
              />
              <div className="px-[24px] laptop:px-0">
                <p className="mb-[24px] font-semibold text-[18px] laptop:text-[32px] leading-[44.8px]">
                  Unlocking business potentials
                </p>
                <div className="flex items-center gap-2 my-2">
                  <CalendarIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] tracking-custom text-text-grey">
                    Mon, 23 Mar
                  </p>
                  <p>-</p>
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] tracking-custom text-text-grey">
                    Mon, 23 Mar
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-[24px]">
                  <ClockIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                    04:00PM
                  </p>
                  <p>-</p>
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                    11:00PM
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-[24px]">
                  <LocationIcon />
                  <p className="font-normal laptop:font-semi-normal text-[14px] laptop:text-[18px] leading-[27px] text-text-grey">
                    Lekki phase 1
                  </p>
                </div>
                <p className="hidden laptop:block mt-[40px] font-semibold text-[18px] leading-[27px] tracking-custom">
                  Contact Us
                </p>
                <div className="hidden laptop:flex items-center gap-[16px] mt-[16px]">
                  <FacebookIcon />
                  <InstagramIcon />
                  <LinkedInIcon />
                  <TwitterIcon />
                  <AttachmentIcon />
                </div>
                <div className="mt-[40px] hidden laptop:block">
                  <Button
                    className={
                      "bg-gradient-green w-[231px] h-[56px] py-3.5 px-6 gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-bottom"
                    }
                  >
                    <p
                      className="font-semi-normal text-[16px] leading-[19.2px]"
                      onClick={toggleModal}
                    >
                      Generate affiliate link
                    </p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full laptop:w-[1312px] mt-[40px] flex flex-col laptop:flex-row justify-between">
            <div className="px-[24px] laptop:px-0">
              <p className="font-semibold text-[24px] leading-[33.6px]">
                About Event
              </p>
              <div className="w-full laptop:w-[720px] mt-[16px]">
                <p className="font-semibold text-[16px] leading-[24px] text-light-black">
                  Are you ready to take your business to the next level?
                </p>
                <p className="font-normal text-[16px] leading-[24px] text-light-black mt-2">
                  Join us at the unlocking business potentials a dynamic
                  conference designed to empower entrepreneurs and business
                  leaders with the tools, strategies, and connections needed to
                  unlock their full potential.
                </p>
              </div>
            </div>
            <div className="laptop:hidden px-[24px]">
              <p className="mt-[40px] font-semibold text-[18px] leading-[27px] tracking-custom">
                Contact Us
              </p>
              <div className="flex items-center gap-[16px] mt-[16px]">
                <FacebookIcon className="w-[24px] h-[24px]" />
                <InstagramIcon className="w-[24px] h-[24px]" />
                <LinkedInIcon className="w-[24px] h-[24px]" />
                <TwitterIcon className="w-[24px] h-[24px]" />
                <AttachmentIcon className="w-[24px] h-[24px]" />
              </div>
            </div>
            <div className="w-full laptop:w-[480px] p-[24px] gap-[16px] bg-white rounded-[12px]">
              <p className="font-semibold text-[18px]">Tickets</p>
              <div className="flex justify-between mt-[16px]">
                <div className="flex flex-col">
                  <p className="font-semi-normal text-[14px]">Regular</p>
                  <p className="font-normal text-[12px] text-text-grey">
                    Unlimited tickets
                  </p>
                </div>
                <p className="font-semi-normal text-[14px]">Free</p>
              </div>
              <div className="flex justify-between mt-[16px]">
                <div className="flex flex-col">
                  <p className="font-semi-normal text-[14px]">Regular</p>
                  <p className="font-normal text-[12px] text-text-grey">
                    5,000 available tickets
                  </p>
                </div>
                <p className="font-semi-normal text-[14px]">N2,000</p>
              </div>
              <div className="flex justify-between mt-[16px]">
                <div className="flex flex-col">
                  <p className="font-semi-normal text-[14px]">VIP</p>
                  <p className="font-normal text-[12px] text-text-grey">
                    1,000 available tickets
                  </p>
                </div>
                <p className="font-semi-normal text-[14px]">N12,000</p>
              </div>
              <div className="flex justify-between mt-[16px]">
                <div className="flex flex-col">
                  <p className="font-semi-normal text-[14px]">VVIP</p>
                  <p className="font-normal text-[12px] text-text-grey">
                    400 available tickets
                  </p>
                </div>
                <p className="font-semi-normal text-[14px]">N100,000</p>
              </div>
            </div>
            <div className="mt-[40px] laptop:hidden px-[24px]">
              <Button
                className={
                  "bg-gradient-green w-full h-[48px] py-[14px] px-[48px] gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-bottom"
                }
              >
                <p
                  className="font-semi-normal text-[16px] leading-[19.2px]"
                  onClick={toggleModal}
                >
                  Generate affiliate link
                </p>
              </Button>
            </div>
          </div>
        </section>
        <AffiliateLinkModal isOpen={isOpen} toggle={toggleModal} />
      </section>
    </MainLayout>
  );
};

export default AgentDetailsPage;
