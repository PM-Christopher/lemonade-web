"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircleMore } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { usersDetailPageViews } from "@/utils/pageViews";
import ActivitiesViews from "@/views/users/ActivitiesViews";
import TribeViews from "@/views/users/TribeViews";
import BusinessView from "@/views/users/BusinessView";
import EventView from "@/views/users/EventView";
import WalletView from "@/views/users/WalletView";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAccountInfoQuery, useUserDetailQuery } from "@/features/user/queries";
import { useReactivateUserMutation } from "@/features/user/mutations";
import type { AdminUser } from "@/features/user/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa6";

// Off the initial bundle — all four are only needed once their triggering
// action fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const TribeModal = dynamic(() => import("@/components/users/TribeModal"), {
  ssr: false,
});
const BalanceModal = dynamic(() => import("@/modals/users/BalanceModal"), {
  ssr: false,
});
const DeactivateModal = dynamic(() => import("@/modals/users/DeactivateModal"), { ssr: false });
const SuspendModal = dynamic(() => import("@/modals/users/SuspendModal"), {
  ssr: false,
});

function UserDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: userDetailData } = useUserDetailQuery(id, {
    enabled: isLoggedIn,
  });
  const user = userDetailData?.user;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isReactivatingUser, setReactivatingUser] = useState<boolean>(false);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: Event) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, []);

  const reloadFunc = () => {
    window.location.reload();
  };

  const [menuOption, setMenuOption] = useState("activities-log");
  const [tribeOpen, setTribeOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const toggleBalanceModalOpen = () => {
    setBalanceModalOpen(!balanceModalOpen);
  };

  const toggleDeactivateModalOpen = () => {
    setDeactivateModalOpen(!deactivateModalOpen);
  };

  const toggleSuspendModalOpen = () => {
    setSuspendModalOpen(!suspendModalOpen);
  };

  const { data: userDetail } = useAccountInfoQuery(id, menuOption, {
    enabled: isLoggedIn,
  });

  const renderViews = () => {
    switch (menuOption) {
      case "activities-log":
        return <ActivitiesViews userDetail={userDetail} />;
      case "tribes":
        return <TribeViews userDetail={userDetail} />;
      case "business":
        return <BusinessView userDetail={userDetail} />;
      case "events":
        return <EventView userDetail={userDetail} />;
      case "wallet":
        return <WalletView userDetail={userDetail} />;
    }
  };

  const toggleTribeModal = () => {
    setTribeOpen(!tribeOpen);
  };

  const reactivateUserMutation = useReactivateUserMutation(id);

  const reactivateUser = () => {
    if (isLoggedIn && id) {
      setReactivatingUser(true);
      reactivateUserMutation.mutate(undefined, {
        onSettled: () => {
          reloadFunc();
          setReactivatingUser(false);
        },
      });
    }
  };

  /**
   *
   * */

  return (
    <MainLayout>
      <TribeModal toggle={toggleTribeModal} isOpen={tribeOpen} />
      <section className="flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-col">
        <div className={"flex h-fit w-[600px] flex-col gap-5 rounded-xl bg-white p-6"}>
          <div className={"flex justify-between"}>
            {user?.profile_image ? (
              <Image
                src={user?.profile_image}
                alt="image"
                width={89}
                height={83}
                className={"bg-light-black h-16 w-16 rounded-full"}
              />
            ) : (
              // null
              <div className={"bg-light-black h-16 w-16 rounded-full"}></div>
            )}

            <div className={"flex gap-1"}>
              <div
                className={
                  "border-light-grey-50 flex h-11 items-center gap-2 rounded-xl border px-3.5 py-3"
                }
              >
                <MessageCircleMore className="w-[15px]" />
                <p className={"text-[14px] font-medium"}>Chat</p>
              </div>
              {user?.status !== "ACTIVE" ? (
                <button
                  className={"bg-gradient-green h-11 w-[156px] rounded-xl border text-center"}
                  onClick={reactivateUser}
                >
                  {isReactivatingUser ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner size={20} className="animate-spin text-white" />
                    </div>
                  ) : (
                    <p className={"text-[16px] font-medium text-white"}>Reactivate user</p>
                  )}
                </button>
              ) : (
                <div className="relative inline-block">
                  <div
                    className={
                      "border-light-grey-50 flex h-11 w-[149px] cursor-pointer items-center justify-between rounded-xl border bg-none px-4 py-2.5"
                    }
                    onClick={handleToggleDropdown}
                  >
                    <div className={"flex items-center justify-between"}>
                      <p className={"text-black-light text-[14px] font-medium"}>Actions</p>
                    </div>
                    <ChevronDown className={"text-text-grey w-5"} />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 z-50 w-[207px] rounded-xl bg-white shadow">
                      <ul>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={toggleSuspendModalOpen}
                        >
                          <p className={"text-[16px] font-normal"}>Suspend User</p>
                        </li>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={toggleDeactivateModalOpen}
                        >
                          <p className={"text-[16px] font-normal"}>Deactivate User</p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Full name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>{user?.fullname}</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Account Plan:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>{user?.account_plan}</p>
              <p className={"text-light-green cursor-pointer text-[14px] font-medium"}>
                View history
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>{user?.status}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.email}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Username:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.username}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Lemonade Tag:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Date Joined:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.date_joined}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Location:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.location}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Social Links:</p>
            </div>

            {user?.social_links?.map((item: AdminUser["social_links"][number], index: number) => (
              <a
                key={index}
                className={"text-[14px] font-medium text-green-400 capitalize underline"}
                href={item?.value}
                target="_blank"
              >
                {item?.name}
              </a>
            ))}
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Referrals:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.referrals}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Tribes Joined:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.tribes_joined}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Tribes created:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.tribes_created}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Threads Created:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.threads_created}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Business:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.business}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Event Created:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.events_created}</p>
          </div>
        </div>

        {/*  */}
        <div className="flex w-full flex-col lg:w-2/3">
          <div className={"h-[700px] rounded-tl-xl rounded-tr-xl bg-white"}>
            <div className="border-b-light-grey-50 mt-2.5 flex justify-between border-b">
              {usersDetailPageViews.map((view, idx) => (
                <div
                  onClick={() => switchOption(view.key)}
                  className={`h-10 cursor-pointer px-4 py-2 ${
                    menuOption === view.key && "border-b-step-color border-b-2"
                  }`}
                  key={idx}
                >
                  <p className="tracking-custom text-center font-sans text-[14px] leading-[21px] font-medium">
                    {view.title}
                  </p>
                </div>
              ))}
            </div>
            {renderViews()}
          </div>
        </div>
      </section>
      <BalanceModal isOpen={balanceModalOpen} toggle={toggleBalanceModalOpen} />
      <DeactivateModal
        isOpen={deactivateModalOpen}
        toggle={toggleDeactivateModalOpen}
        id={id}
        reload={reloadFunc}
      />
      <SuspendModal
        isOpen={suspendModalOpen}
        toggle={toggleSuspendModalOpen}
        id={id}
        reload={reloadFunc}
      />
    </MainLayout>
  );
}

export default UserDetailsClient;
