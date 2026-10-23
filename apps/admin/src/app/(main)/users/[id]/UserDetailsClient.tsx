"use client";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { Avatar } from "@/components/global/Avatar";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, MessageCircleIcon } from "lucide-react";
import { SocialLink } from "@/components/global/SocialLink";
import { usersDetailPageViews } from "@/utils/pageViews";
import ActivitiesViews from "@/views/users/ActivitiesViews";
import TribeViews from "@/views/users/TribeViews";
import BusinessView from "@/views/users/BusinessView";
import EventView from "@/views/users/EventView";
import WalletView from "@/views/users/WalletView";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/redux/store";
import {
  userKeys,
  useAccountInfoQuery,
  useUserBusinessQuery,
  useUserDetailQuery,
} from "@/features/user/queries";
import type { AdminUser } from "@/features/user/api";
import { toApiTime, type DateRange } from "@/components/global/DateRangePicker";
import { GetStatusClass, capitalizeWords } from "@/utils/helper";

// Each dialog loads only when its action is used.
const UserStatusActionModal = dynamic(() => import("@/modals/users/UserStatusActionModal"), {
  ssr: false,
});
const ReactivateUserModal = dynamic(() => import("@/modals/users/ReactivateUserModal"), {
  ssr: false,
});
const AccountPlanModal = dynamic(() => import("@/modals/users/AccountPlanModal"), { ssr: false });
const ChatModal = dynamic(() => import("@/modals/users/ChatModal"), { ssr: false });
const UserTribeModal = dynamic(() => import("@/modals/users/UserTribeModal"), { ssr: false });

const LOGS_PER_PAGE = DEFAULT_PAGE_SIZE;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-28.75 shrink-0">
        <p className="text-text-grey text-meta leading-normal font-medium">{label}:</p>
      </div>
      {children}
    </div>
  );
}

function UserDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: userDetailData } = useUserDetailQuery(id, { enabled: isLoggedIn });
  const user = userDetailData?.user;

  const [menuOption, setMenuOption] = useState("activities-log");
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [statusAction, setStatusAction] = useState<"suspend" | "deactivate" | null>(null);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const queryClient = useQueryClient();
  const [openTribeId, setOpenTribeId] = useState<string | number | undefined>(undefined);
  const [range, setRange] = useState<DateRange | null>(null);
  const [logPage, setLogPage] = useState(1);
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const params =
    menuOption === "activities-log"
      ? {
          page: logPage,
          per_page: LOGS_PER_PAGE,
          ...(range ? { start_date: toApiTime(range.start), end_date: toApiTime(range.end) } : {}),
        }
      : menuOption === "events"
        ? { filter: eventFilter }
        : undefined;

  const { data: userDetail } = useAccountInfoQuery(id, menuOption, {
    enabled: isLoggedIn && menuOption !== "business",
    params,
  });
  const { data: businessData, isLoading: businessLoading } = useUserBusinessQuery(id, {
    enabled: isLoggedIn && menuOption === "business",
  });

  const renderViews = () => {
    switch (menuOption) {
      case "activities-log":
        return (
          <ActivitiesViews
            userDetail={userDetail}
            range={range}
            onRangeChange={(next) => {
              setRange(next);
              setLogPage(1);
            }}
            page={logPage}
            perPage={LOGS_PER_PAGE}
            onPageChange={setLogPage}
          />
        );
      case "tribes":
        return <TribeViews userDetail={userDetail} onOpen={setOpenTribeId} />;
      case "business":
        return <BusinessView business={businessData?.business} loading={businessLoading} />;
      case "events":
        return (
          <EventView userDetail={userDetail} filter={eventFilter} onFilterChange={setEventFilter} />
        );
      case "wallet":
        return <WalletView userDetail={userDetail} />;
    }
  };

  const isActive = user?.status === "ACTIVE";
  const statusLabel = user?.status ? capitalizeWords(user.status) : "";

  return (
    <>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white p-6 lg:w-150">
          <div className="flex justify-between">
            <Avatar name={user?.fullname} image={user?.profile_image} size="lg" />

            <div className="flex gap-3">
              <button
                type="button"
                className="border-light-grey-50 flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-4"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircleIcon className="text-text-grey w-4" />
                <p className="text-black-light text-body-s font-medium">Chat</p>
                {user && user.unread_support_messages > 0 && (
                  <span
                    aria-label={`${user.unread_support_messages} unread messages`}
                    className="bg-red-1 text-meta rounded-full px-1.5 leading-normal font-medium text-white"
                  >
                    {user.unread_support_messages}
                  </span>
                )}
              </button>

              {user && !isActive ? (
                <button
                  className="bg-gradient-green h-11 w-39 cursor-pointer rounded-xl border text-center"
                  onClick={() => setReactivateOpen(true)}
                >
                  <p className="text-body-l font-medium text-white">Reactivate user</p>
                </button>
              ) : (
                <div className="relative inline-block" ref={actionsRef}>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={actionsOpen}
                    className="border-light-grey-50 flex h-11 w-37.25 cursor-pointer items-center justify-between rounded-xl border bg-none px-4 py-2.5"
                    onClick={() => setActionsOpen((open) => !open)}
                  >
                    <p className="text-black-light text-body-s font-medium">Actions</p>
                    <ChevronDown className="text-text-grey w-5" />
                  </button>
                  {actionsOpen && (
                    <ul
                      role="menu"
                      className="absolute top-full left-0 z-50 w-51.75 rounded-xl bg-white shadow"
                    >
                      {[
                        { action: "suspend" as const, label: "Suspend user" },
                        { action: "deactivate" as const, label: "Deactivate user" },
                      ].map((item) => (
                        <li key={item.action} role="none">
                          <button
                            role="menuitem"
                            className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setActionsOpen(false);
                              setStatusAction(item.action);
                            }}
                          >
                            <p className="text-body-l font-normal">{item.label}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          <Row label="Full name">
            <p className="text-body-s font-medium">{user?.fullname}</p>
          </Row>
          <Row label="User ID">
            <p className="text-body-s font-medium">{user?.unique_id}</p>
          </Row>
          <Row label="Account Plan">
            <div className="flex gap-1">
              <p className="text-body-s font-medium capitalize">{user?.account_plan}</p>
              <button
                type="button"
                className="text-light-green text-body-s cursor-pointer font-medium"
                onClick={() => setPlanOpen(true)}
              >
                View history
              </button>
            </div>
          </Row>
          <Row label="Status">
            <p className={`text-body-s font-medium ${GetStatusClass(statusLabel)}`}>
              {statusLabel}
            </p>
          </Row>
          {user?.status_reason && (
            <Row label="Reason">
              <p className="text-body-s font-medium">{user.status_reason}</p>
            </Row>
          )}
          <Row label="Email Address">
            <p className="text-body-s font-medium">{user?.email}</p>
          </Row>
          <Row label="Username">
            <p className="text-body-s font-medium">{user?.username}</p>
          </Row>
          <Row label="Lemonade Tag">
            <p className="text-body-s font-medium">{user?.lemon_id}</p>
          </Row>
          <Row label="Date Joined">
            <p className="text-body-s font-medium">{user?.date_joined}</p>
          </Row>
          <Row label="Location">
            <p className="text-body-s font-medium">{user?.location}</p>
          </Row>
          <Row label="Social Links">
            <div className="flex gap-3">
              {user?.social_links?.map((item: AdminUser["social_links"][number], index: number) => (
                <SocialLink key={index} name={item?.name ?? ""} href={item?.value} />
              ))}
            </div>
          </Row>
          <Row label="Referrals">
            <p className="text-body-s font-medium">{user?.referrals}</p>
          </Row>
          <Row label="Tribes Joined">
            <p className="text-body-s font-medium">{user?.tribes_joined}</p>
          </Row>
          <Row label="Tribes created">
            <p className="text-body-s font-medium">{user?.tribes_created}</p>
          </Row>
          <Row label="Threads Created">
            <p className="text-body-s font-medium">{user?.threads_created}</p>
          </Row>
          <Row label="Business">
            <p className="text-body-s font-medium">{user?.business ?? "None"}</p>
          </Row>
          <Row label="Events Created">
            <p className="text-body-s font-medium">{user?.events_created}</p>
          </Row>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <div className="min-h-175 rounded-tl-xl rounded-tr-xl bg-white">
            <div className="border-b-light-grey-50 mt-2.5 flex justify-between border-b">
              {usersDetailPageViews.map((view) => (
                <button
                  type="button"
                  onClick={() => setMenuOption(view.key)}
                  className={`h-10 cursor-pointer px-4 py-2 ${
                    menuOption === view.key && "border-b-step-color border-b-2"
                  }`}
                  key={view.key}
                >
                  <p className="tracking-custom text-body-s text-center font-sans font-medium">
                    {view.title}
                  </p>
                </button>
              ))}
            </div>
            {renderViews()}
          </div>
        </div>
      </section>
      {statusAction && (
        <UserStatusActionModal
          isOpen
          toggle={() => setStatusAction(null)}
          id={id}
          action={statusAction}
        />
      )}
      {reactivateOpen && (
        <ReactivateUserModal isOpen toggle={() => setReactivateOpen(false)} id={id} />
      )}
      {chatOpen && (
        <ChatModal
          isOpen
          toggle={() => {
            setChatOpen(false);
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
          }}
          userId={id}
          userName={user?.fullname}
        />
      )}
      {planOpen && <AccountPlanModal isOpen toggle={() => setPlanOpen(false)} id={id} />}
      {openTribeId !== undefined && (
        <UserTribeModal
          isOpen
          toggle={() => setOpenTribeId(undefined)}
          userId={id}
          tribeId={openTribeId}
        />
      )}
    </>
  );
}

export default UserDetailsClient;
