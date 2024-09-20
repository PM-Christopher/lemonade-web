"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import WebIcon from "@/image/icons/World.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import BankAccountModal from "@/components/Events/Modals/BankAccountModal";

const AddTicketPage = () => {
    const [ticketType, setTicketType] = useState("")
    const [toggleModal, setToggleModal] = useState(false)

    const switchTicket = (type: string) => {
        setTicketType(type)
    }

    const activateModal = () => {
        setToggleModal(!toggleModal)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Add ticket</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="bg-white mt-10 w-[640px] p-[48px] rounded-[12px] flex flex-col">
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket type</p>
                    <div className="flex gap-2 mt-[16px]">
                        <div
                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[24px] items-center ${ticketType === "free" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                            onClick={() => switchTicket("free")}>
                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">Free</p>
                        </div>
                        <div
                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[24px] items-center ${ticketType === "paid" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                            onClick={() => switchTicket("paid")}>
                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">Paid</p>
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                            name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder=""
                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                        />
                    </div>
                    {
                        ticketType === "paid" && (
                            <>
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                                        price</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder=""
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input className="border-[1px] border-text-grey w-[20px]" type="checkbox"/>
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Transfer
                                        commission to guest</p>
                                </div>
                            </>
                        )
                    }
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                            stock</Label>
                        <div className="flex justify-between gap-3">
                            <select className="h-12 rounded-xl bg-light_grey form-font border-0 p-2 w-full">
                                <option value="limited">Limited stock</option>
                                <option value="unlimited">Select stock</option>
                            </select>
                            <Input
                                id="fullname"
                                type="text"
                                placeholder=""
                                className="h-12 rounded-xl bg-light_grey form-font border-0 w-full"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Purchase
                            limit</Label>
                        <select className="h-12 rounded-xl bg-light_grey form-font border-0 p-2">
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                    <div className="grid gap-2 mt-[24px]">
                        <Label htmlFor="fullname"
                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                            description</Label>
                        <textarea
                            className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none"></textarea>
                    </div>
                    <Button className="rounded-[12px] h-[48px] p-[14px] px-[48px] bg-light-green-10 mt-[24px] border-0 shadow-none">
                        <div className="flex gap-1 items-center">
                            <PlusIcon className="text-light-green" />
                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px] text-light-green">Add another ticket</p>
                        </div>
                    </Button>
                    <div className="flex justify-between gap-3">
                        <Button className="rounded-[12px] h-[48px] p-[14px] px-[48px] bg-light-grey-50 mt-[24px] border-[1px] border-light-grey-50 shadow-none w-full">
                            <div className="flex gap-1 items-center">
                                <p className="font-sans font-semi-normal text-[16px] leading-[19.2px] text-text-grey">Save as draft</p>
                            </div>
                        </Button>
                        <Button className="rounded-[12px] h-[48px] p-[14px] px-[48px] bg-gradient-green mt-[24px] border-0 shadow-none w-full" onClick={activateModal}>
                            <div className="flex gap-1 items-center">
                                <p className="font-sans font-semi-normal text-[16px] leading-[19.2px] text-white">Publish</p>
                            </div>
                        </Button>
                    </div>
                </div>
                <BankAccountModal toggle={activateModal} option={toggleModal} />
            </section>
        </section>
    );
}

export default AddTicketPage;