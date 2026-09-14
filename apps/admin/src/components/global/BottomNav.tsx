import React from 'react';
import Image from "next/image";
import {usePathname} from "next/navigation";
import {pageLinks} from "@/utils/pageLinks";
import Link from "next/link";
import {isActiveLink} from "@/lib/activeLink";

const BottomNav = () => {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap items-center justify-center p-2 px-10 bg-white fixed bottom-0 left-0 w-full">
            <div className="flex justify-between items-center gap-8">
                {
                    pageLinks.map((link, idx) => (
                        <Link href={link.path} key={idx}>
                            <div
                                className={`flex flex-col gap-2 items-center ${isActiveLink(pathname, link.path, true) ? "bg-light-green-10 p-[8px] rounded-[8px] text-light-green" : "text-text-grey"}  `}>
                                {/* <Image src={link.icon} alt="home" width={12.8}/> */}
                                <p className={`text-[12px] leading-[14.4px] ${isActiveLink(pathname, link.path, true) ? "font-semibold" : "font-normal"}`}>{link.name}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </nav>
    );
}

export default BottomNav;
