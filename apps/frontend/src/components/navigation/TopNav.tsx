import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "../../../pageLinks";
import { isActiveLink } from "@/lib/activeLink";
import { useSelector } from "react-redux";
import { formatName, getInitials } from "@/lib/helper";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@lemonade/ui";
import { useRequest } from "@/hooks/useRequest";
import dayjs from "dayjs";
import { FaBell } from "react-icons/fa";
import { usePersistentMenuState } from "@/context/MenuStateProvider";

const TopNav = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

  const { data } = useRequest("/user/notification");
  const { setSelectedMenu } = usePersistentMenuState();

  const handleViewMore = (notification: any) => {
    setSelectedNotification(notification);
    setOpenDetailModal(true);
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="flex flex-wrap items-center justify-between bg-white p-2 px-10">
        <div>
          {isMobile ? (
            <Image src={"/images/logo.png"} alt="logo" width={73} height={32} priority />
          ) : (
            <Image src={"/images/logo.png"} alt="logo" width={127} height={56} priority />
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
                    ? "bg-light-green-10 text-light-green rounded-[8px] p-[8px]"
                    : "text-text-grey"
                } `}
              >
                <Image src={link.icon} alt="home" width={12.8} height={12.8} />
                <p
                  className={`text-[12px] leading-[14.4px] ${
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
          <div>
            <Image
              src={"/images/bellIcon.png"}
              alt="notification"
              width={28}
              height={28}
              className="cursor-pointer"
              onClick={() => setOpenNotifications(true)}
            />
          </div>
          <div className="tablet:block hidden">
            <p className="font-sans text-[18px] leading-[27px] font-normal">
              Hello,{" "}
              <span className="font-semibold">
                {user?.fullname ? formatName(user.fullname)?.[0] : ""}
              </span>
            </p>
          </div>
          <div className="group cursor-pointer transition-all duration-300">
            <Link href="/settings">
              {user?.profile_image ? (
                <Image
                  src={user?.profile_image}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-[40px] w-[40px] rounded-full border-[2px] border-[#3B4152] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                />
              ) : (
                <div className="bg-gradient-green flex h-[40px] w-[40px] items-center justify-center rounded-full border-[2px] border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                  <p className="font-ruso text-[18px]">{getInitials(user?.fullname)}</p>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
        <DialogContent
          className={`scrollbar-hide max-h-[80vh] overflow-y-auto ${isMobile ? "" : "sm:top-8 sm:right-8 sm:translate-x-0 sm:translate-y-0"}`}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-wide text-gray-600 uppercase">
              Notifications
            </DialogTitle>
          </DialogHeader>
          {data?.notifications?.length > 0 ? (
            data.notifications.map((notification: any, index: number) => (
              <div
                key={index}
                className={`${index !== 0 && "mt-4"} ${
                  index !== data.notifications.length - 1 && "border-b border-gray-200 pb-4"
                } flex flex-col gap-3`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <FaBell size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-800">
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

                <div className="flex justify-end">
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
                  <Image
                    src={selectedNotification.meta?.image}
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
                    {selectedNotification.meta?.message}
                  </p>
                  <p>
                    <span className="font-medium">From:</span> {selectedNotification.meta?.user_id}
                  </p>
                  <p>
                    <span className="font-medium">Requested At:</span>{" "}
                    {dayjs(selectedNotification.meta?.created_at).format("DD MMM YYYY, hh:mm A")}
                  </p>
                </div>
              )}

              {selectedNotification?.type === "event" && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="font-semibold">Event Details</p>
                  <Image
                    src={selectedNotification.meta?.event_image}
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
                        {selectedNotification.meta.socials.map((s: any, idx: number) => (
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
