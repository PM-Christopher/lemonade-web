import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg"
import event_det_image from "@/image/event_images/event_details.png"
import Image from "next/image";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import ClockIcon from "@/image/icons/clock.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import AttachmentIcon from "@/image/icons/attachments.svg"
import FacebookIcon from "@/image/icons/facebook-color.svg"
import InstagramIcon from "@/image/icons/instagram-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import {Button} from "@/components/ui/button";

function EventDetailsPage() {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft />
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Event details</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex justify-center">
                    <div className="flex w-[1312px] bg-white rounded-[16px] items-center gap-[48px] p-[4px]">
                        <Image src={event_det_image} alt="event details"/>
                        <div>
                            <p className="mb-[24px] font-sans font-semibold text-[32px] leading-[44.8px]">Unlocking
                                business
                                potentials</p>
                            <div className="flex items-center gap-2 my-2">
                                <CalendarIcon/>
                                <p className="font-sans font-semi-normal text-[18px] leading-[27px] tracking-custom text-text-grey">Mon,
                                    23
                                    Mar</p>
                                <p>-</p>
                                <p className="font-sans font-semi-normal text-[18px] leading-[27px] tracking-custom text-text-grey">Mon,
                                    23
                                    Mar</p>
                            </div>
                            <div className="flex items-center gap-2 mt-[24px]">
                                <ClockIcon/>
                                <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">04:00PM</p>
                                <p>-</p>
                                <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">11:00PM</p>
                            </div>
                            <div className="flex items-center gap-2 mt-[24px]">
                                <LocationIcon/>
                                <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-text-grey">Lekki
                                    phase 1</p>
                            </div>
                            <p className="mt-[40px] font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Contact
                                Us</p>
                            <div className="flex items-center gap-[16px] mt-[16px]">
                                <FacebookIcon/>
                                <InstagramIcon/>
                                <LinkedInIcon/>
                                <TwitterIcon/>
                                <AttachmentIcon/>
                            </div>
                            <div className="mt-[40px]">
                                <Button
                                    className={"bg-gradient-green w-[231px] h-[56px] py-3.5 px-6 gap-2 rounded-[12px] border-b-2 border-transparent shadow-custom-top shadow-custom-bottom"}>
                                    <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Buy ticket
                                        from
                                        ₦2,000</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[1312px] mt-[40px]">
                    <p className="font-sans font-semibold text-[24px] leading-[33.6px]">About Event</p>
                    <div className="w-[720px] mt-[16px]">
                        <p className="font-sans font-semibold text-[16px] leading-[24px] text-light-black">Are you ready to take your
                            business to the next level?</p>
                        <p className="font-sans font-normal text-[16px] leading-[24px] text-light-black mt-2">
                            Join us at the unlocking business potentials a dynamic conference designed to empower
                            entrepreneurs and business leaders with the tools, strategies, and connections needed to
                            unlock their full potential.
                        </p>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default EventDetailsPage;