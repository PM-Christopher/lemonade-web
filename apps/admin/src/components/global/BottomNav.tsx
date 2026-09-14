import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { pageLinks } from "@/utils/pageLinks";
import Link from "next/link";
import { isActiveLink } from "@/lib/activeLink";

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 flex w-full flex-wrap items-center justify-center bg-white p-2 px-10">
      <div className="flex items-center justify-between gap-8">
        {pageLinks.map((link, idx) => (
          <Link href={link.path} key={idx}>
            <div
              className={`flex flex-col items-center gap-2 ${isActiveLink(pathname, link.path, true) ? "rounded-[8px] bg-light-green-10 p-[8px] text-light-green" : "text-text-grey"} `}
            >
              {/* <Image src={link.icon} alt="home" width={12.8}/> */}
              <p
                className={`text-[12px] leading-[14.4px] ${isActiveLink(pathname, link.path, true) ? "font-semibold" : "font-normal"}`}
              >
                {link.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
