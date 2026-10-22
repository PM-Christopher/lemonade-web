"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import { pageLinks } from "@/utils/pageLinks";
import Image from "next/image";
import { LogOut, UserCircle } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";

function SideNav({}) {
  const { push, pathname } = useNavigation();
  const profileActive = pathname === routes.PROFILE || pathname.startsWith(`${routes.PROFILE}/`);
  const dispatch = useAppDispatch();
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
            message: apiMessage(`Logged out`),
            type: "success",
          }),
        );
      },
      onSettled: () => {
        push(routes.LOGIN);
      },
    });
  };
  return (
    <aside className="border-r-grey-20 flex h-full w-64 shrink-0 flex-col gap-5 border-r bg-white p-4">
      <div className="mb-4 shrink-0 text-2xl font-bold">
        <Image src={images.LOGO} alt="logo" width={127} height={56} />
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {visibleLinks.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`hover:bg-link-color hover:font-semiBold hover:text-black-light text-body-s flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans font-normal ${
                    isActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t-grey-20 shrink-0 border-t pt-4 pb-4">
        <a
          href={routes.PROFILE}
          className={`hover:bg-link-color hover:font-semiBold hover:text-black-light text-body-s flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans font-normal ${
            profileActive ? "bg-link-color font-semiBold text-black" : "text-text-grey"
          }`}
        >
          <UserCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Profile
        </a>
        <div
          onClick={() => {
            handleLogout();
          }}
          className="text-red-1 hover:bg-red-1 text-body-s flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-sans font-normal hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          Logout
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
