"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import { pageLinks } from "@/utils/pageLinks";
import Image from "next/image";
import Link from "next/link";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { images } from "@/lib/images";

function SideNav({}) {
  const { pathname } = useNavigation();
  const { data: currentAdmin } = useCurrentAdminQuery();
  const visibleLinks = pageLinks.filter(
    (item) => !item.permission || currentAdmin?.permissions?.includes(item.permission),
  );
  return (
    <aside className="border-r-grey-20 flex h-full w-64 shrink-0 flex-col gap-3 border-r bg-white p-4">
      <div className="mb-2 shrink-0 text-2xl font-bold">
        <Image src={images.LOGO} alt="logo" width={127} height={56} />
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {visibleLinks.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`hover:bg-link-color hover:font-semiBold hover:text-black-light text-body-s flex w-full items-center gap-3 rounded-xl px-3 py-2 font-sans font-normal ${
                    isActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default SideNav;
