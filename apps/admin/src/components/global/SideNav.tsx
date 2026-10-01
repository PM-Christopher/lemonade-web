"use client";
import React from "react";
import { pageLinks } from "@/utils/pageLinks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function SideNav({}) {
  const pathname = usePathname();
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const { data: currentAdmin } = useCurrentAdminQuery();
  const visibleLinks = pageLinks.filter(
    (item) => !item.permission || currentAdmin?.permissions?.includes(item.permission),
  );
  const handleLogout = () => {
    // Redux/query-cache cleanup happens in useLogoutMutation's
    // onSettled regardless of whether the backend call succeeds.
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Logged out`,
            type: "success",
          }),
        );
      },
      onSettled: () => {
        router.push("/login");
      },
    });
  };
  return (
    <aside className="bg-gray-20 border-r-grey-20 flex w-64 flex-col gap-5 border-r bg-white p-4">
      <div className="mb-8 text-2xl font-bold">
        <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      </div>
      <nav>
        <ul className="space-y-2">
          {visibleLinks.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`hover:bg-link-color hover:font-semiBold hover:text-black-light block w-48 rounded-xl px-3 py-2.5 font-sans text-[14px] font-normal ${
                    isActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t-grey-20 mt-auto border-t pt-4 pb-4">
        <a
          href={"/profile"}
          className={`hover:bg-link-color hover:font-semiBold hover:text-black-light block w-48 rounded-xl px-3 py-2.5 font-sans text-[14px] font-normal ${
            profileActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
          }`}
        >
          Profile
        </a>
        <div
          onClick={() => {
            handleLogout();
          }}
          className="text-red-1 hover:bg-red-1 block rounded-xl px-3 py-2.5 font-sans text-[14px] font-normal hover:text-white"
        >
          Logout
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
