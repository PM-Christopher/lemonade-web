"use client";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bell } from "lucide-react";
import {
  useAdminNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  type AdminNotification,
} from "@/features/notifications";
import { useNavigation } from "@/hooks/useNavigation";
import { CountBadge } from "@/components/global/CountBadge";

dayjs.extend(relativeTime);

// Bell with an unread count and a list of what needs the team's attention.
export function NotificationBell() {
  const { push } = useNavigation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { data } = useAdminNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const unread = data?.unread_count ?? 0;

  // Close on a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const openNotification = (notification: AdminNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setOpen(false);
    if (notification.meta?.link) push(notification.meta.link);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <CountBadge count={unread} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute top-full right-0 z-50 mt-2 flex max-h-[70vh] w-96 flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        >
          <div className="border-b-grey-20 flex items-center justify-between border-b px-4 py-3">
            <p className="font-semiBold text-body-s">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                className="text-light-green text-meta cursor-pointer font-medium"
                disabled={markAllRead.isPending}
                onClick={() => markAllRead.mutate()}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="overflow-y-auto">
            {(data?.notifications.length ?? 0) === 0 ? (
              <p className="text-text-grey text-body-s p-6 text-center">
                Nothing needs you right now.
              </p>
            ) : (
              data?.notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="border-b-grey-20 flex w-full cursor-pointer items-start gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                  onClick={() => openNotification(notification)}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? "bg-transparent" : "bg-red-500"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`text-body-s block font-semibold ${notification.read ? "text-text-grey" : "text-black"}`}
                    >
                      {notification.title}
                    </span>
                    <span className="text-text-grey text-meta block leading-normal">
                      {notification.body}
                    </span>
                    <span className="text-grey-40 text-meta block leading-normal">
                      {dayjs(notification.created_at).fromNow()}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
