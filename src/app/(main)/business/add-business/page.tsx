import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import {SingleFileUploader} from "@/components/global/FileUploader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import FacebookIcon from "@/image/icons/facebook-color.svg";
import MessageIcon from "@/image/icons/MessageIcon.svg"
import PhoneIcon from "@/image/icons/PhoneIcon.svg"
import WebIcon from "@/image/icons/WebIcon.svg"
import {Button} from "@/components/ui/button";

function AddBusinessPage() {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Add business</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="bg-white mt-10 w-[640px] p-[48px] rounded-[12px] flex flex-col">
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px]">BUSINESS
                        DETAILS</p>
                    <SingleFileUploader/>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
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
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
                            category</Label>
                        <select id="fullname" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2">
                            <option value="">Select category</option>
                            <option value="spirituality">Spirituality</option>
                        </select>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
                            description</Label>
                        <textarea
                            className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none"></textarea>
                    </div>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">BUSINESS
                        ADDRESS</p>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="city"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">City</Label>
                        <Input
                            id="city"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="country"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Country</Label>
                        <select id="country" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2">
                            <option value="">Select country</option>
                            <option value="spirituality">Spirituality</option>
                        </select>
                    </div>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">SERVICE DETAILS</p>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="city"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Services</Label>
                        <Input
                            id="city"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="city"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Service
                            Rate</Label>
                        <Input
                            id="city"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    <p className="font-normal text-[14px] text-text-grey">Portfolio gallery <span>(Optional)</span></p>
                    <SingleFileUploader/>
                    <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">CONTACT
                        DETAILS</p>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <MessageIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <PhoneIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Phone number"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                        <div>
                            <WebIcon/>
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Website URL"
                            />
                        </div>
                    </div>

                    <Button className="mt-[32px] bg-gradient-green h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom">
                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">List business</p>
                    </Button>
                </div>
            </section>
        </section>
    );
}

export default AddBusinessPage;