"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import UserSearch from "@/components/connect/UserSearch";
import type { FoundUser } from "@/features/connect/api";
import RequestCard from "@/components/connect/RequestCard";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import MainLayout from "@/components/layouts/MainLayout";
import { useInvitesQuery } from "@/features/connect/queries";
import { InviteSkeleton } from "@/components/Skeletons";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

// Off the initial bundle — both are only needed once their triggering
// action fires (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const InviteModal = dynamic(() => import("@/components/connect/Modal/InviteModal"), {
  ssr: false,
});
const ConnectModal = dynamic(() => import("@/components/connect/Modal/ConnectModal"), {
  ssr: false,
});

const RequestsClient = () => {
  const { push } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [inviteIndex, setInviteIndex] = useState<number | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: invitesData, isLoading: loading } = useInvitesQuery({
    enabled: Boolean(user?.id),
  });
  const invites = invitesData?.invites ?? [];
  const [connectTarget, setConnectTarget] = useState<FoundUser | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleInviteIndex = (index: number) => {
    setInviteIndex(index);
  };

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="laptop:flex-row laptop:items-center laptop:px-16 flex flex-col items-start justify-between bg-white p-2 px-4">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => push(routes.CONNECT)}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">
              Connection requests
            </p>
          </div>
          <div className="laptop:w-72 w-full">
            <UserSearch onSelect={setConnectTarget} placeholder="Search username..." />
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:w-200 laptop:border laptop:border-grey-20 max-h-164.75 w-screen rounded-xl border-none bg-white p-6">
            <div className="hide-scrollbar max-h-screen overflow-y-auto">
              {loading ? (
                <InviteSkeleton count={4} />
              ) : invites.length > 0 ? (
                invites?.map((invite, index: number) => (
                  <RequestCard
                    index={index}
                    toggleInviteIndex={toggleInviteIndex}
                    key={index}
                    invite={invite}
                    toggle={toggleMenu}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-8 shadow-sm sm:py-12">
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
                    <p className="text-base font-semibold text-gray-700">No Requests Found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Check back later for connection requests from other users. You can also invite
                      friends to connect with you using the invite link below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {inviteIndex !== null && (
          <InviteModal invite={invites[inviteIndex]} toggle={toggleMenu} isOpen={isOpen} />
        )}
        {connectTarget && (
          <ConnectModal
            users={[connectTarget]}
            toggle={() => setConnectTarget(null)}
            isOpen
            key={connectTarget.id}
          />
        )}
      </section>
    </MainLayout>
  );
};

export default RequestsClient;
