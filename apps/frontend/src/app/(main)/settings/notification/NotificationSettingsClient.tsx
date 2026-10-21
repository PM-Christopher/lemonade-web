"use client";
import { routes } from "@/lib/routes";
import React, { useState } from "react";
import { BackHeader } from "@/components/global/BackHeader";
import ChevronRight from "@/images/icons/chevronRight.svg";
import dynamic from "next/dynamic";
import { useNotificationSettingsQuery } from "@/features/authentication/queries";
import type { AppSettings } from "@/features/authentication/api";

import MainLayout from "@/components/layouts/MainLayout";

// Off the initial bundle; only needed once a notification row is clicked.
const NotificationSettingsModal = dynamic(
  () => import("@/components/settings/Modal/NotificationSettingsModal"),
  { ssr: false },
);

type SettingKey = Exclude<keyof AppSettings, "id" | "push_notification">;

type SettingRow = { key: SettingKey; title: string; description: string };

const sections: { label: string; rows: SettingRow[] }[] = [
  {
    label: "TRIBE",
    rows: [
      {
        key: "new_thread",
        title: "New thread in Tribe",
        description: "Notify me when there is a new thread in any Tribe I have joined.",
      },
      {
        key: "thread_engagements",
        title: "Thread engagements",
        description: "Notify me when I have new likes and comments on my threads.",
      },
    ],
  },
  {
    label: "EVENT",
    rows: [
      {
        key: "ticket_sales",
        title: "Ticket sales",
        description: "Notify me when I have new ticket sales on events I created.",
      },
      {
        key: "ticket_payout",
        title: "Ticket payout",
        description: "Notify me when I receive payouts for my events.",
      },
    ],
  },
  {
    label: "BUSINESS",
    rows: [
      {
        key: "service_offer",
        title: "Service offer",
        description: "Notify me when I receive new service offers.",
      },
      {
        key: "service_status",
        title: "Service status",
        description:
          "Notify me of updates on active services like payment, progress, and disputes.",
      },
      {
        key: "service_payout",
        title: "Service payout",
        description: "Notify me when I receive payouts for my completed services.",
      },
    ],
  },
  {
    label: "CONNECT",
    rows: [
      {
        key: "connect_request",
        title: "Connect request",
        description: "Notify me when I get new connect requests",
      },
      {
        key: "new_message",
        title: "New message",
        description: "Notify me when I get new messages",
      },
    ],
  },
];

// Both channels are on until the user turns them off.
const channelLabel = (setting?: AppSettings[SettingKey] | null) => {
  const channels = [
    setting?.in_app_notification !== false && "In-app",
    setting?.email !== false && "Email",
  ].filter(Boolean);
  return channels.length ? channels.join(", ") : "Off";
};

const NotificationSettingsClient = () => {
  const { data } = useNotificationSettingsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<SettingKey | "">("");
  const [notificationSettings, setNotificationSettings] = useState({});

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const selectNotification = (type: SettingKey) => {
    setNotificationType(type);
    setNotificationSettings(data?.app_settings?.[type] ?? {});
    toggleModal();
  };

  const renderHeader = () => {
    const row = sections.flatMap((section) => section.rows).find((r) => r.key === notificationType);
    return { title: row?.title ?? "", description: row?.description ?? "" };
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Notification settings" href={routes.SETTINGS} />
        <section className="mt-4 flex flex-col items-center px-2.5">
          <div className="laptop:w-160 flex w-full flex-col gap-6 rounded-xl">
            {sections.map((section) => (
              <div key={section.label} className="flex flex-col gap-4">
                <p className="font-semi-normal text-light-black text-meta leading-normal">
                  {section.label}
                </p>
                <div className="laptop:w-160 flex w-full flex-col rounded-xl bg-white">
                  {section.rows.map((row) => (
                    <div
                      key={row.key}
                      className="flex cursor-pointer items-center justify-between p-3 px-4"
                      onClick={() => selectNotification(row.key)}
                    >
                      <div className="flex flex-col">
                        <p className="font-semi-normal text-body-s">{row.title}</p>
                        <p className="text-text-grey text-meta leading-normal font-normal">
                          {channelLabel(data?.app_settings?.[row.key])}
                        </p>
                      </div>
                      <ChevronRight />
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
