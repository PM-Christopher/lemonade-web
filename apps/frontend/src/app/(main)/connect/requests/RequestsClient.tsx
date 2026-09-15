"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import RequestCard from "@/components/connect/RequestCard";
import InviteModal from "@/components/connect/Modal/InviteModal";
import ConnectModal from "@/components/connect/Modal/ConnectModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { useInvitesQuery } from "@/features/connect/queries";
import { useFindUserMutation } from "@/features/connect/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { InviteSkeleton } from "@/components/Skeletons";

const RequestsClient = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [inviteIndex, setInviteIndex] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { data: invitesData, isLoading: loading } = useInvitesQuery({
    enabled: Boolean(user?.id),
  });
  const invites = invitesData?.invites ?? [];
  const findUserMutation = useFindUserMutation();
  const connUser = findUserMutation.data;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleConnectModal = () => {
    setIsConnectOpen(!isConnectOpen);
  };

  const toggleInviteIndex = (index: number) => {
    setInviteIndex(index);
  };

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      if (e.currentTarget.value !== "") {
        findUserMutation.mutate(e.currentTarget.value, {
          onSuccess: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "User found",
                type: "success",
              }),
            );
            e.target.value = "";
            toggleConnectModal();
          },
          onError: (err: any) => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: err?.message || "User not found",
                type: "error",
              }),
            );
          },
        });
      } else {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Please enter a user name to proceed",
            type: "error",
          }),
        );
      }
    }
  };

  return (
    <MainLayout>
      <section className="bg-white pb-10 laptop:bg-light_grey">
        <div className="flex flex-col items-start justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:flex-row laptop:items-center laptop:px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.push("/connect")}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">
              Connection requests
            </p>
          </div>
          <div className="group relative flex w-full items-center gap-2 laptop:w-fit">
            {/* Search Container */}
            <div className="flex h-[40px] w-full items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px] laptop:w-[235px]">
              <div>
                <SearchIcon />
              </div>
              <div className="relative w-full">
                <input
                  id="search"
                  type="text"
                  className="w-full rounded-xl border-0 bg-light_grey px-[10px] text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder="Search username..."
                  onKeyDown={(e) => handleSearch(e)}
                />

                {/* Tooltip */}
                <div className="pointer-events-none absolute left-0 mt-1 w-max translate-y-1 rounded-md bg-gray-800 px-2 py-1 text-[12px] text-white opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  Press <span className="font-semibold">Enter</span> to search
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <div className="max-h-[659px] w-screen rounded-[12px] border-none bg-white p-[24px] laptop:w-[800px] laptop:border-[1px] laptop:border-grey-20">
            <div className="hide-scrollbar max-h-screen overflow-y-auto">
              {loading ? (
                <InviteSkeleton count={4} />
              ) : invites.length > 0 ? (
                invites?.map((invite: any, index: number) => (
                  <RequestCard
                    index={index}
                    toggleInviteIndex={toggleInviteIndex}
                    key={index}
                    invite={invite}
                    toggle={toggleMenu}
                    user={user}
                  />
                ))
              ) : (
                <div className="sm:py-12 flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-8 shadow-sm">
                  <div className="flex max-w-md flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.5 4.5l17 7.5-17 7.5 3-7.5-3-7.5zm3 7.5l6 3 6-3-6-3-6 3z"
                        />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700">
                      No Requests Found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Check back later for connection requests from other users.
                      You can also invite friends to connect with you using the
                      invite link below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {inviteIndex !== null && (
          <InviteModal
            invite={invites[inviteIndex]}
            toggle={toggleMenu}
            isOpen={isOpen}
          />
        )}
        {connUser && (
          <ConnectModal
            users={connUser}
            toggle={toggleConnectModal}
            isOpen={isConnectOpen}
            authUser={user}
          />
        )}
      </section>
    </MainLayout>
  );
};

export default RequestsClient;
