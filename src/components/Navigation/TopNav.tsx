import React, {useState} from "react"
import Image from "next/image"
import logo_url from "@/image/logo.png"
import avatar_2 from "@/image/avatar_2.png"
import bell_icon from "@/image/icons/Icons.png"
import Link from "next/link";
import {navLinks} from "../../../pageLinks";
import { usePathname } from 'next/navigation';
import {activeLink} from "@/lib/activeLink";
import {useSelector} from "react-redux";
import {formatName} from "@/lib/helper";

const TopNav = () => {
    const {user} = useSelector((state: any) => state.auth)

    console.log({user})

    return (
        <nav className="flex flex-wrap items-center justify-between p-2 px-10 bg-white">
            <div>
                <Image src={logo_url} alt="logo" width={127} height={56}/>
            </div>
            <div className="flex justify-center items-center gap-8">
                {
                    navLinks.map((link, idx) => (
                        <Link href={link.path}>
                            <div className={`flex flex-col gap-2 items-center ${activeLink(link.path, true) ? "bg-light-green-10 p-[8px] rounded-[8px] text-light-green" : "text-text-grey"}  `}>
                                <Image src={link.icon} alt="home" width={12.8}/>
                                <p className={`text-[12px] leading-[14.4px] ${activeLink(link.path, true) ? "font-semibold" : "font-normal"}`}>{link.name}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <Image src={bell_icon} alt="notification" width={28} />
                </div>
                <div>
                    <p className="font-sans text-[18px] leading-[27px] font-normal">
                        Hello, <span className="font-semibold">{formatName(user?.fullname)[0]}</span>
                    </p>
                </div>
                <div>
                    <Image src={user?.profile_image} alt="avatar 2" width={40} height={40} className="rounded-full border-[2px] border-[#3B4152] w-[40px] h-[40px]" />
                </div>
            </div>
        </nav>
    )
}

export default TopNav