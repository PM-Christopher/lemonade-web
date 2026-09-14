"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import NotificationSettingsModal from "@/components/settings/Modal/NotificationSettingsModal";
import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const NotificationSettingsPage = () => {
  const router = useRouter();
  const { data, loading } = useRequest(`user/profile/notification-settings`);
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
    setNotificationSettings(data?.app_settings[type]);
    toggleModal();
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">
              Notification settings
            </p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center px-[10px]">
          <div className="flex w-full flex-col gap-[24px] rounded-[12px] laptop:w-[640px]">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[12px] font-semi-normal text-light-black">TRIBE</p>
              <div className="flex w-full flex-col rounded-[12px] bg-white laptop:w-[640px]">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">New thread in Tribe</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("new_thread")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Thread engagements</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("thread_engagements")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[12px] font-semi-normal text-light-black">EVENT</p>
              <div className="flex w-full flex-col rounded-[12px] bg-white laptop:w-[640px]">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Ticket sales</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("ticket_sales")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Ticket payout</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("ticket_payout")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[12px] font-semi-normal text-light-black">BUSINESS</p>
              <div className="flex w-full flex-col rounded-[12px] bg-white laptop:w-[640px]">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Service offer</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_offer")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Service status</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_status")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Service payout</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("service_payout")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[12px] font-semi-normal text-light-black">CONNECT</p>
              <div className="flex w-full flex-col rounded-[12px] bg-white laptop:w-[640px]">
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">Connect request</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
                  </div>
                  <ChevronRight
                    className="cursor-pointer"
                    onClick={() => selectNotification("connect_request")}
                  />
                </div>
                <div className="flex items-center justify-between p-[12px] px-[16px]">
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semi-normal">New message</p>
                    <p className="text-[12px] font-normal text-text-grey">In-app, Email</p>
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

export default NotificationSettingsPage;
