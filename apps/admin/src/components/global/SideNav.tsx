"use client";
import React from "react";
import { pageLinks } from "@/utils/pageLinks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { useSelector } from "react-redux";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function SideNav({}) {
  const pathname = usePathname();
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile");
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
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
    <aside className="bg-gray-20 flex w-64 flex-col gap-[20px] border-r-[1px] border-r-grey-20 bg-white p-4">
      <div className="mb-8 text-2xl font-bold">
        <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      </div>
      <nav>
        <ul className="space-y-[8px]">
          {pageLinks.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`block w-[192px] rounded-[12px] px-[12px] py-[10px] font-sans text-[14px] font-normal hover:bg-link-color hover:font-semiBold hover:text-black-light ${
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
      <div className="mt-auto border-t-[1px] border-t-grey-20 pb-[16px] pt-[16px]">
        <a
          href={"/profile"}
          className={`block w-[192px] rounded-[12px] px-[12px] py-[10px] font-sans text-[14px] font-normal hover:bg-link-color hover:font-semiBold hover:text-black-light ${
            profileActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
          }`}
        >
          Profile
        </a>
        <div
          onClick={() => {
            handleLogout();
          }}
          className="block rounded-[12px] px-[12px] py-[10px] font-sans text-[14px] font-normal text-red-1 hover:bg-red-1 hover:text-white"
        >
          Logout
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
