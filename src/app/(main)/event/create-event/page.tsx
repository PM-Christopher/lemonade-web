"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import {SingleFileUploader} from "@/components/global/FileUploader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LocationIcon from "@/image/icons/location-large.svg"
import WebIcon from "@/image/icons/World.svg"
import CalendarIcon from "@/image/icons/calendar.svg";
import ClockIcon from "@/image/icons/clock.svg";
import AffiliateUsersIcon from "@/image/icons/affiliate_users.svg";
import AttachmentIcon from "@/image/icons/attachments.svg";
import InstagramIcon from "@/image/icons/instagram-color.svg"
import FacebookIcon from "@/image/icons/facebook-color.svg"
import LinkedInIcon from "@/image/icons/linkedin-color.svg"
import TwitterIcon from "@/image/icons/twitter-color.svg"
import {Button} from "@/components/ui/button";

function CreateEventPage() {
    const [eventType, setEventType] = useState("")

    const switchEvent = (type: string) => {
        setEventType(type)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Add event</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="bg-white mt-10 w-[640px] p-[48px] rounded-[12px] flex flex-col">
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px]">EVENT DETAILS</p>
                    <SingleFileUploader/>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Event
                            name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Event
                            description</Label>
                        <textarea
                            className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none"></textarea>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Event
                            category</Label>
                        <select id="fullname" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2">
                            <option value="">Select category</option>
                            <option value="spirituality">Spirituality</option>
                        </select>
                    </div>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">EVENT
                        TYPE</p>
                    <div className="flex gap-2 mt-[16px]">
                        <div
                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[16px] items-center ${eventType === "physical" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                            onClick={() => switchEvent("physical")}>
                            <LocationIcon/>
                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">Physical</p>
                        </div>
                        <div
                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[16px] items-center ${eventType === "online" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                            onClick={() => switchEvent("online")}>
                            <WebIcon/>
                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">Online</p>
                        </div>
                    </div>
                    {
                        eventType === "physical" && (
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="fullname"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Event
                                    location</Label>
                                <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px]">
                                    <div>
                                        <LocationIcon/>
                                    </div>
                                    <div>
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="Enter location..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        eventType === "online" && (
                            <>
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Meeting
                                        Platform</Label>
                                    <select id="fullname" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2">
                                        <option value="">Select category</option>
                                        <option value="google-meet">Google meet</option>
                                    </select>
                                </div>

                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Meeting
                                        link</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder=""
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    />
                                </div>

                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Meeting
                                        passcode</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder=""
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    />
                                </div>
                            </>
                        )
                    }
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Event time
                            zone</Label>
                        <select id="fullname" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2">
                            <option value="">Select category</option>
                            <option value="spirituality">Spirituality</option>
                        </select>
                    </div>

                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Start
                            date</Label>
                        <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                                <div>
                                    <CalendarIcon/>
                                </div>
                                <div>
                                    <input
                                        id="search"
                                        type="date"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                                <div>
                                    <ClockIcon/>
                                </div>
                                <div>
                                    <input
                                        id="search"
                                        type="time"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">End
                            date</Label>
                        <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                                <div>
                                    <CalendarIcon/>
                                </div>
                                <div>
                                    <input
                                        id="search"
                                        type="date"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                                <div>
                                    <ClockIcon/>
                                </div>
                                <div>
                                    <input
                                        id="search"
                                        type="time"
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">AFFILIATE
                        PROGRAM</p>
                    <div className="flex justify-between mt-[28px]">
                        <div className="flex gap-2">
                            <div className="mt-1">
                                <AffiliateUsersIcon/>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-sans font-normal text-[16px] leading-[24px] tracking-custom">Enable
                                    Affiliate program</p>
                                <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">Affiliates
                                    will earn 0.01% per ticket sales</p>
                            </div>
                        </div>
                        <div>
                            <p>Checkbox</p>
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Set
                            commission</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                        <span className="font-sans font-normal text-[12px] leading-[14.4px] text-grey-40">Commission will be based on the per ticket sold</span>
                    </div>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">SOCIAL
                        DETAILS <span className="font-semi-normal text-text-grey">(Optional)</span></p>

                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <AttachmentIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <FacebookIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <LinkedInIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <TwitterIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <InstagramIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <Button className="mt-[24px] bg-gradient-green h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom">
                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Continue</p>
                    </Button>
                </div>
            </section>
        </section>
    );
}

export default CreateEventPage;