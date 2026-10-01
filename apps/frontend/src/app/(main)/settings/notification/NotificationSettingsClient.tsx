"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import dynamic from "next/dynamic";
import { useNotificationSettingsQuery } from "@/features/authentication/queries";
import type { AppSettings } from "@/features/authentication/api";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

// Off the initial bundle — only needed once a notification row is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const NotificationSettingsModal = dynamic(
  () => import("@/components/settings/Modal/NotificationSettingsModal"),
  { ssr: false },
);

const NotificationSettingsClient = () => {
  const router = useRouter();
  const { data } = useNotificationSettingsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({});

  const renderHeader = () => {
    switch (notificationType) {
      case "new_thread":
        return {
          title: "New thread in tribe",
          description: "Notify me when there is a new thread in any tribe I have joined.",
        };
      case "thread_engagements":
        return {
          title: "Thread engagements",
          description: "Notify me when I have new likes and comments on my threads.",
        };
      case "ticket_sales":
        return {
          title: "Ticket sales",
          description: "Notify me when I have new ticket sales on events I created.",
        };
      case "ticket_payout":
        return {
          title: "Ticket payout",
          description: "Notify me when I receive payouts for my events.",
        };
      case "service_offer":
        return {
          title: "Service offer",
          description: "Notify me when I receive new service offers.",
        };
      case "service_status":
        return {
          title: "Service status",
          description:
            "Notify me of updates on active services like payment, progress, and disputes.",
        };
      case "service_payout":
        return {
          title: "Service payout",
          description: "Notify me when I receive payouts for my completed services.",
        };
      case "connect_request":
        return {
          title: "connect request",
          description: "Notify me when I get new connect requests",
        };
      case "new_message":
        return {
          title: "New message",
          description: "Notify me when I get new messages",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const selectNotification = (type: string) => {
    setNotificationType(type);
    setNotificationSettings(data?.app_settings?.[type as keyof AppSettings] ?? {});
    toggleModal();
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="laptop:px-[64px] flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[16px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">
              Notification settings
            </p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center px-[10px]">
          <div className="laptop:w-[640px] flex w-full flex-col gap-[24px] rounded-[12px]">
            <div className="flex flex-col gap-[16px]">
              <p className="font-semi-normal text-light-black text-[12px]">TRIBE</p>
              <div className="laptop:w-[640px] flex w-full flex-col rounded-[12px] bg-white">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">New thread in Tribe</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("new_thread")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Thread engagements</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("thread_engagements")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="font-semi-normal text-light-black text-[12px]">EVENT</p>
              <div className="laptop:w-[640px] flex w-full flex-col rounded-[12px] bg-white">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Ticket sales</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("ticket_sales")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Ticket payout</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("ticket_payout")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="font-semi-normal text-light-black text-[12px]">BUSINESS</p>
              <div className="laptop:w-[640px] flex w-full flex-col rounded-[12px] bg-white">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Service offer</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_offer")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Service status</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_status")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Service payout</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_payout")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="font-semi-normal text-light-black text-[12px]">CONNECT</p>
              <div className="laptop:w-[640px] flex w-full flex-col rounded-[12px] bg-white">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">Connect request</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("connect_request")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="font-semi-normal text-[14px]">New message</p>
                    <p className="text-text-grey text-[12px] font-normal">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("new_message")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <NotificationSettingsModal
          type={notificationType}
          renderHeader={renderHeader}
          settings={notificationSettings}
          isOpen={isOpen}
          toggle={toggleModal}
        />
      </section>
    </MainLayout>
  );
};

export default NotificationSettingsClient;
