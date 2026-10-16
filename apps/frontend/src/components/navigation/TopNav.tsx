import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "../../../pageLinks";
import { isActiveLink } from "@/lib/activeLink";
import { useSelector } from "react-redux";
import { formatName, getInitials } from "@/lib/helper";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@lemonade/ui";
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  countUnread,
  formatBadgeCount,
  type AppNotification,
} from "@/features/notifications";
import dayjs from "dayjs";
import { FaBell } from "react-icons/fa";
import { usePersistentMenuState } from "@/context/MenuStateProvider";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

const TopNav = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const isMobile = useIsMobile(641);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

  const { data } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const unreadCount = countUnread(data?.notifications);
  const { setSelectedMenu } = usePersistentMenuState();

  const handleViewMore = (notification: AppNotification) => {
    setSelectedNotification(notification);
    setOpenDetailModal(true);
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="flex flex-wrap items-center justify-between bg-white p-2 px-10">
        <div>
          {isMobile ? (
            <Image src={images.LOGO} alt="logo" width={73} height={32} priority />
          ) : (
            <Image src={images.LOGO} alt="logo" width={127} height={56} priority />
          )}
        </div>

        <div className="tablet:flex hidden items-center justify-center gap-8">
          {navLinks.map((link, idx) => (
            <Link
              href={link.path}
              key={idx}
              onClick={() => {
                setSelectedMenu(link.title);
              }}
            >
              <div
                className={`flex flex-col items-center gap-2 ${
                  isActiveLink(pathname, link.path, true)
                    ? "bg-light-green-10 text-light-green rounded-lg p-2"
                    : "text-text-grey"
                } `}
              >
                <Image src={link.icon} alt="home" width={12.8} height={12.8} />
                <p
                  className={`text-meta ${
                    isActiveLink(pathname, link.path, true) ? "font-semibold" : "font-normal"
                  }`}
                >
                  {link.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            onClick={() => setOpenNotifications(true)}
          >
            <Image src={images.BELL} alt="" width={28} height={28} />
            {unreadCount > 0 && (
              <span className="text-meta absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 leading-none font-semibold text-white">
                {formatBadgeCount(unreadCount)}
              </span>
            )}
          </button>
          <div className="tablet:block hidden">
            <p className="text-body-xl font-sans font-normal">
              Hello,{" "}
              <span className="font-semibold">
                {user?.fullname ? formatName(user.fullname)?.[0] : ""}
              </span>
            </p>
          </div>
          <div className="group cursor-pointer transition-all duration-300">
            <Link href={routes.SETTINGS}>
              {user?.profile_image ? (
                <FallbackImage
                  src={user?.profile_image}
                  fallbackSrc={images.AVATAR_4}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-[#3B4152] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                />
              ) : (
                <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                  <p className="font-ruso text-body-xl">{getInitials(user?.fullname)}</p>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
        <DialogContent
          overlayClassName="bg-transparent"
          className={`scrollbar-hide max-h-[80vh] overflow-y-auto ${isMobile ? "" : "sm:top-8 sm:right-8 sm:translate-x-0 sm:translate-y-0"}`}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-wide text-gray-600 uppercase">
              Notifications
            </DialogTitle>
          </DialogHeader>
          {(data?.notifications?.length ?? 0) > 0 ? (
            data!.notifications.map((notification: AppNotification, index: number) => (
              <div
                key={index}
                className={`${index !== 0 && "mt-4"} ${
                  index !== data!.notifications.length - 1 && "border-b border-gray-200 pb-4"
                } flex flex-col gap-3`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <FaBell size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-base text-gray-800 ${notification.read_at ? "font-medium" : "font-bold"}`}
                      >
                        {!notification.read_at && (
                          <span
                            className="mr-2 inline-block size-2 rounded-full bg-green-500"
                            aria-label="Unread"
                          />
                        )}
                        {notification?.title ?? ""}
                      </p>
                      <p className="text-sm text-gray-400">
                        {dayjs(notification?.meta?.created_at || notification?.created_at).format(
                          "DD MMM",
                        )}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {notification?.body ?? ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  {!notification.read_at && (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm font-medium text-gray-500 hover:text-gray-700"
                      loading={markRead.isPending && markRead.variables === notification.id}
                      onClick={() => markRead.mutate(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm font-medium text-green-600 hover:text-green-700"
                    onClick={() => handleViewMore(notification)}
                  >
                    View More
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <p>No new notifications</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="scrollbar-hide max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedNotification?.title ?? "Notification Detail"}
            </DialogTitle>
          </DialogHeader>
          {selectedNotification ? (
            <div className="space-y-4">
              <p className="text-gray-700">{selectedNotification?.body}</p>

              {selectedNotification?.type === "tribe" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Tribe Details</p>
                  <FallbackImage
                    src={selectedNotification.meta?.image}
                    fallbackSrc={images.PLACEHOLDER}
                    alt="tribe image"
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                  <p>Name: {selectedNotification.meta?.tribe_name}</p>
                  <p>Category: {selectedNotification.meta?.category}</p>
                  <p>Description: {selectedNotification.meta?.description}</p>
                  <p>Monetized: {selectedNotification.meta?.monetized ? "Yes" : "No"}</p>
                  <p>Private: {selectedNotification.meta?.private ? "Yes" : "No"}</p>
                </div>
              )}

              {selectedNotification?.type === "announcement" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Announcement Details</p>
                  <p>Title: {selectedNotification.meta?.title}</p>
                  <p>Content: {selectedNotification.meta?.content}</p>
                  <p>
                    Scheduled Date:{" "}
                    {dayjs(selectedNotification.meta?.date_scheduled).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </p>
                  <p>Status: {selectedNotification.meta?.status}</p>
                </div>
              )}

              {selectedNotification?.type === "connect" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Connect Request Details</p>
                  <p>
                    <span className="font-medium">Message:</span>{" "}
                    {selectedNotification.meta?.message ??
                      selectedNotification.meta?.invite_message}
                  </p>
                  <p>
                    <span className="font-medium">From:</span>{" "}
                    {selectedNotification.meta?.from_username ??
                      selectedNotification.body?.split(" wants")[0]}
                  </p>
                  <p>
                    <span className="font-medium">Requested At:</span>{" "}
                    {dayjs(selectedNotification.meta?.created_at).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <Button asChild className="bg-gradient-green mt-2 w-full">
                    <Link
                      href={routes.CONNECT_REQUESTS}
                      onClick={() => {
                        setOpenDetailModal(false);
                        setOpenNotifications(false);
                        if (!selectedNotification.read_at) markRead.mutate(selectedNotification.id);
                      }}
                    >
                      View request
                    </Link>
                  </Button>
                </div>
              )}

              {selectedNotification?.type === "event" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Event Details</p>
                  <FallbackImage
                    src={selectedNotification.meta?.event_image}
                    fallbackSrc={images.DEFAULT_EVENT}
                    alt="event image"
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                  <p>Event Name: {selectedNotification.meta?.event_name}</p>
                  <p>Category: {selectedNotification.meta?.category}</p>
                  <p>
                    Date:{" "}
                    {dayjs(selectedNotification.meta?.start_date).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <p>Location: {selectedNotification.meta?.location}</p>
                  <p>Description: {selectedNotification.meta?.event_description}</p>
                  {selectedNotification.meta?.socials && (
                    <div>
                      <p className="font-semibold">Socials:</p>
                      <ul className="list-disc pl-4">
                        {selectedNotification.meta.socials.map((s, idx: number) => (
                          <li key={idx}>
                            <a
                              href={s.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {s.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-gray-500">No details to show</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopNav;
