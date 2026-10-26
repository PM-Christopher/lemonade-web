import { BrandLogo } from "@/components/global/BrandLogo";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React, { useEffect, useRef, useState, type CSSProperties } from "react";
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
  useMarkAllNotificationsReadMutation,
  countUnread,
  formatBadgeCount,
  type AppNotification,
} from "@/features/notifications";
import dayjs from "dayjs";
import { NotificationIcon } from "./NotificationIcon";
import { usePersistentMenuState } from "@/context/MenuStateProvider";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

const TopNav = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const isMobile = useIsMobile(641);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  // Panel position, taken from the bell so it opens right under it.
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

  const { data } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const unreadCount = countUnread(data?.notifications);
  const { setSelectedMenu } = usePersistentMenuState();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Closing two stacked dialogs can leave the page unclickable; clear it once both are shut.
  useEffect(() => {
    if (openNotifications || openDetailModal) return;
    const timer = setTimeout(() => {
      if (document.body.style.pointerEvents === "none") document.body.style.pointerEvents = "";
    }, 350);
    return () => clearTimeout(timer);
  }, [openNotifications, openDetailModal]);

  // Publishes the nav height so sticky sub-headers can sit right under it.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--top-nav-h", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleViewMore = (notification: AppNotification) => {
    setSelectedNotification(notification);
    setOpenNotifications(false);
    setOpenDetailModal(true);
    if (!notification.read_at) markRead.mutate(notification.id);
  };

  return (
    <div ref={wrapperRef} className="sticky top-0 z-50">
      <nav className="flex flex-wrap items-center justify-between bg-white p-2 px-10">
        <div>
          {isMobile ? (
            <BrandLogo width={73} height={32} className="h-8 w-auto object-contain" />
          ) : (
            <BrandLogo width={127} height={56} className="h-14 w-auto object-contain" />
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
                <Image src={link.icon} alt="home" width={16} height={16} />
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
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setPanelStyle({
                top: rect.bottom + 8,
                right: Math.max(window.innerWidth - rect.right - 16, 8),
                left: "auto",
                translate: "none",
                transform: "none",
              });
              setOpenNotifications(true);
            }}
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
          className="flex max-h-[80vh] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden border-0 p-0 shadow-xl sm:max-w-sm"
          style={isMobile ? undefined : panelStyle}
        >
          <DialogHeader className="flex-row items-center justify-between gap-2 border-b border-gray-100 py-3 pr-12 pl-4">
            <DialogTitle className="text-meta leading-normal font-semibold tracking-wide text-gray-600 uppercase">
              Notifications
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="link"
                className="text-meta h-auto p-0 leading-normal font-medium text-green-600 hover:text-green-700"
                loading={markAllRead.isPending}
                onClick={() => markAllRead.mutate()}
              >
                Mark all as read
              </Button>
            )}
          </DialogHeader>
          <div className="scrollbar-hide flex-1 overflow-y-auto">
            {(data?.notifications?.length ?? 0) > 0 ? (
              data!.notifications.map((notification: AppNotification) => {
                const isRead = Boolean(notification.read_at);
                return (
                  <div key={notification.id} className="border-b border-gray-100 last:border-b-0">
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50"
                      onClick={() => handleViewMore(notification)}
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 ${isRead ? "text-gray-400" : "text-gray-700"}`}
                      >
                        <NotificationIcon type={notification.type} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className={`text-body-s font-semibold ${isRead ? "text-gray-400" : "text-gray-900"}`}
                          >
                            {notification.title ?? ""}
                          </span>
                          <span className="text-meta shrink-0 leading-normal text-gray-400">
                            {dayjs(notification.meta?.created_at || notification.created_at).format(
                              "DD MMM",
                            )}
                          </span>
                        </span>
                        <span
                          className={`text-body-s block ${isRead ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {notification.body ?? ""}
                        </span>
                      </span>
                    </button>
                    {!isRead && (
                      <div className="flex justify-end px-4 pb-2">
                        <Button
                          variant="link"
                          className="text-meta h-auto p-0 leading-normal font-medium text-gray-500 hover:text-gray-700"
                          loading={markRead.isPending && markRead.variables === notification.id}
                          onClick={() => markRead.mutate(notification.id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <p>No new notifications</p>
              </div>
            )}
          </div>
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
                      }}
                    >
                      View request
                    </Link>
                  </Button>
                </div>
              )}

              {selectedNotification?.type === "connect_response" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Connect Request Details</p>
                  <p>
                    <span className="font-medium">User:</span>{" "}
                    {selectedNotification.meta?.from_username}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedNotification.meta?.status === "accepted" ? "Accepted" : "Rejected"}
                  </p>
                  <p>
                    <span className="font-medium">Responded At:</span>{" "}
                    {dayjs(selectedNotification.meta?.created_at).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  {selectedNotification.meta?.status === "accepted" && (
                    <Button asChild className="bg-gradient-green mt-2 w-full">
                      <Link
                        href={routes.CONNECT}
                        onClick={() => {
                          setOpenDetailModal(false);
                          setOpenNotifications(false);
                        }}
                      >
                        Open chat
                      </Link>
                    </Button>
                  )}
                </div>
              )}

              {selectedNotification?.type === "service" &&
                selectedNotification.meta?.business_id && (
                  <Button asChild className="bg-gradient-green w-full">
                    <Link
                      href={routes.BUSINESS_SENT_OFFERS(selectedNotification.meta.business_id)}
                      onClick={() => {
                        setOpenDetailModal(false);
                        setOpenNotifications(false);
                      }}
                    >
                      View sent offers
                    </Link>
                  </Button>
                )}

              {selectedNotification?.type === "business" &&
                selectedNotification.meta?.business_id && (
                  <Button asChild className="bg-gradient-green w-full">
                    <Link
                      href={routes.BUSINESS_DETAIL(selectedNotification.meta.business_id)}
                      onClick={() => {
                        setOpenDetailModal(false);
                        setOpenNotifications(false);
                      }}
                    >
                      View business
                    </Link>
                  </Button>
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
