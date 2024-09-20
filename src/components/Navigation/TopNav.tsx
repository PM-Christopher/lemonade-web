'use client'
import React, {useState} from "react"
import Image from "next/image"
import logo_url from "@/image/logo.png"
import avatar_2 from "@/image/avatar_2.png"
import bell_icon from "@/image/icons/Icons.png"
import home_icon from "@/image/icons/home_icon.png"
import forum_icon from "@/image/icons/chat_icon.png"
import event_icon from "@/image/icons/calendar_icon.png"
import business_icon from "@/image/icons/case_icon.png"
import connect_icon from "@/image/icons/world_icon.png"

export default function TopNav() {
    return (
        <nav className="flex flex-wrap items-center justify-between p-2 px-10 bg-white">
            <div>
                <Image src={logo_url} alt="logo" width={127} height={56}/>
            </div>
            <div className="flex justify-center items-center gap-8">
                <div className="flex flex-col gap-2 items-center">
                    <Image src={home_icon} alt="home" width={12.8} />
                    <p className="font-sans text-[12px] font-normal leading-[14.4px]">Home</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <Image src={forum_icon} alt="home" width={13} />
                    <p className="font-sans text-[12px] font-normal leading-[14.4px]">Forums</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <Image src={event_icon} alt="home" width={12.8} />
                    <p className="font-sans text-[12px] font-normal leading-[14.4px]">Events</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <Image src={business_icon} alt="home" width={12.8} />
                    <p className="font-sans text-[12px] font-normal leading-[14.4px]">Business</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <Image src={connect_icon} alt="home" width={12.8} />
                    <p className="font-sans text-[12px] font-normal leading-[14.4px]">Connect</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <Image src={bell_icon} alt="notification" width={28} />
                </div>
                <div>
                    <p className="font-sans text-[18px] leading-[27px] font-normal">Hello, <span className="font-semibold">Christine</span></p>
                </div>
                <div>
                    <Image src={avatar_2} alt="avatar 2" width={40} />
                </div>
            </div>
        </nav>
    )
}