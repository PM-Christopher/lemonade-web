"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  MessageCircleMore,
  PrinterIcon,
} from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { usersDetailPageViews } from "@/utils/pageViews";
import ActivitiesViews from "@/views/users/ActivitiesViews";
import TribeViews from "@/views/users/TribeViews";
import TribeModal from "@/components/users/TribeModal";
import BusinessView from "@/views/users/BusinessView";
import EventView from "@/views/users/EventView";
import WalletView from "@/views/users/WalletView";
import BalanceModal from "@/modals/users/BalanceModal";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useAccountInfoQuery,
  useUserDetailQuery,
} from "@/features/user/queries";
import { useReactivateUserMutation } from "@/features/user/mutations";
import DeactivateModal from "@/modals/users/DeactivateModal";
import SuspendModal from "@/modals/users/SuspendModal";
import suspendModal from "@/modals/users/SuspendModal";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa6";

function UserDetailsClient({ id }: { id: number | undefined }) {
  const router = useRouter();
  const currentPage: number = 1;
  const totalPages: number = 10;
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
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener,
      );
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
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        <div
          className={
            "flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"
          }
        >
          <div className={"flex justify-between"}>
            {user?.profile_image ? (
              <Image
                src={user?.profile_image}
                alt="image"
                width={89}
                height={83}
                className={"h-[64px] w-[64px] rounded-full bg-light-black"}
              />
            ) : (
              // null
              <div
                className={"h-[64px] w-[64px] rounded-full bg-light-black"}
              ></div>
            )}

            <div className={"flex gap-[4px]"}>
              <div
                className={
                  "flex h-[44px] items-center gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 px-[14px] py-[12px]"
                }
              >
                <MessageCircleMore className="w-[15px]" />
                <p className={"text-[14px] font-medium"}>Chat</p>
              </div>
              {user?.status !== "ACTIVE" ? (
                <button
                  className={
                    "h-[44px] w-[156px] rounded-[12px] border-[1px] bg-gradient-green text-center"
                  }
                  onClick={reactivateUser}
                >
                  {isReactivatingUser ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner
                        size={20}
                        className="animate-spin text-white"
                      />
                    </div>
                  ) : (
                    <p className={"text-[16px] font-medium text-white"}>
                      Reactivate user
                    </p>
                  )}
                </button>
              ) : (
                <div className="relative inline-block">
                  <div
                    className={
                      "flex h-[44px] w-[149px] cursor-pointer items-center justify-between rounded-[12px] border-[1px] border-light-grey-50 bg-none px-[16px] py-[10px]"
                    }
                    onClick={handleToggleDropdown}
                  >
                    <div className={"flex items-center justify-between"}>
                      <p className={"text-[14px] font-medium text-black-light"}>
                        Actions
                      </p>
                    </div>
                    <ChevronDown className={"w-[20px] text-text-grey"} />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute left-0 top-full z-50 w-[207px] rounded-[12px] bg-white shadow">
                      <ul>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={toggleSuspendModalOpen}
                        >
                          <p className={"text-[16px] font-normal"}>
                            Suspend User
                          </p>
                        </li>
                        <li
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={toggleDeactivateModalOpen}
                        >
                          <p className={"text-[16px] font-normal"}>
                            Deactivate User
                          </p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Full name:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>{user?.fullname}</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                User ID:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Account Plan:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>{user?.account_plan}</p>
              <p
                className={
                  "cursor-pointer text-[14px] font-medium text-light-green"
                }
              >
                View history
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Status:
              </p>
            </div>
            <p className={"text-[14px] font-medium text-light-green-70"}>
              {user?.status}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Email Address:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.email}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Username:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.username}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Lemonade Tag:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Date Joined:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.date_joined}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Location:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.location}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Social Links:
              </p>
            </div>

            {user?.social_links?.map((item: any, index: number) => (
              <a
                key={index}
                className={
                  "text-[14px] font-medium capitalize text-green-400 underline"
                }
                href={item?.value}
                target="_blank"
              >
                {item?.name}
              </a>
            ))}
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Referrals:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.referrals}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Tribes Joined:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.tribes_joined}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Tribes created:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.tribes_created}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Threads Created:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.threads_created}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Business:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.business}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Event Created:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>{user?.events_created}</p>
          </div>
        </div>

        {/*  */}
        <div className="lg:w-2/3 flex w-full flex-col">
          <div
            className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}
          >
            <div className="mt-[10px] flex justify-between border-b-[1px] border-b-light-grey-50">
              {usersDetailPageViews.map((view, idx) => (
                <div
                  onClick={() => switchOption(view.key)}
                  className={`h-10 cursor-pointer px-[16px] py-[8px] ${
                    menuOption === view.key && "border-b-2 border-b-step-color"
                  }`}
                  key={idx}
                >
                  <p className="tracking-custom text-center font-sans text-[14px] font-medium leading-[21px]">
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
