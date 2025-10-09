import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "../../../pageLinks";
import { activeLink } from "@/lib/activeLink";
import { useSelector } from "react-redux";
import { formatName } from "@/lib/helper";
import { useMediaQuery } from "react-responsive";
import { Empty, Modal, Button } from "antd";
import { useRequest } from "@/hooks/useRequest";
import dayjs from "dayjs";
import { FaBell } from "react-icons/fa";

const TopNav = () => {
  const { user, authToken } = useSelector((state: any) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };
  // const { data } = useRequest("/notification", "GET", {}, true, getHeader());

  const handleViewMore = (notification: any) => {
    setSelectedNotification(notification);
    setOpenDetailModal(true);
  };

  return (
    <div className="!relative">
      <nav className="flex flex-wrap items-center justify-between p-2 px-10 bg-white relative">
        <div>
          {isMobile ? (
            <Image src={"/images/logo.png"} alt="logo" width={73} height={32} />
          ) : (
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={127}
              height={56}
            />
          )}
        </div>

        <div className="hidden tablet:flex justify-center items-center gap-8">
          {navLinks.map((link, idx) => (
            <Link href={link.path} key={idx}>
              <div
                className={`flex flex-col gap-2 items-center ${
                  activeLink(link.path, true)
                    ? "bg-light-green-10 p-[8px] rounded-[8px] text-light-green"
                    : "text-text-grey"
                }  `}
              >
                <Image src={link.icon} alt="home" width={12.8} height={12.8} />
                <p
                  className={`text-[12px] leading-[14.4px] ${
                    activeLink(link.path, true)
                      ? "font-semibold"
                      : "font-normal"
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
          <div className="hidden tablet:block">
            <p className="font-sans text-[18px] leading-[27px] font-normal">
              Hello,{" "}
              <span className="font-semibold">
                {user?.fullname ? formatName(user.fullname)?.[0] : ""}
              </span>
            </p>
          </div>
          <div>
            <Link href={"/settings"}>
              <Image
                src={user?.profile_image}
                alt="avatar 2"
                width={40}
                height={40}
                className="rounded-full border-[2px] border-[#3B4152] w-[40px] h-[40px]"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/*<Modal*/}
      {/*  title={*/}
      {/*    <p className="uppercase text-text-grey text-lg">Notifications</p>*/}
      {/*  }*/}
      {/*  open={openNotifications}*/}
      {/*  onCancel={() => setOpenNotifications(false)}*/}
      {/*  footer={null}*/}
      {/*  className={`custom-modal !fixed ${isMobile ? "" : "!right-20 !top-20"}`}*/}
      {/*  closeIcon={null}*/}
      {/*  styles={{*/}
      {/*    maxHeight: isMobile ? "60vh" : "400px",*/}
      {/*    overflowY: "auto",*/}
      {/*    padding: "16px",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {data?.notifications?.length > 0 ? (*/}
      {/*    data?.notifications?.map((notification: any, index: number) => (*/}
      {/*      <div*/}
      {/*        key={index}*/}
      {/*        className={`${index !== 0 && "mt-5"} ${*/}
      {/*          index !== data?.notifications?.length - 1 &&*/}
      {/*          "border-b border-b-grey-light pb-5"*/}
      {/*        } flex flex-col gap-3 !w-full`}*/}
      {/*      >*/}
      {/*        <div className="flex items-start gap-3">*/}
      {/*          <div className="size-10 rounded-full flex items-center justify-center bg-gray-100">*/}
      {/*            <FaBell size={18} />*/}
      {/*          </div>*/}
      {/*          <div className="space-y-1 !w-full">*/}
      {/*            <div className="flex justify-between items-center !w-full">*/}
      {/*              <p className="text-black-light text-base font-semibold">*/}
      {/*                {notification?.title ?? ""}*/}
      {/*              </p>*/}
      {/*              <p className="text-grey-90">*/}
      {/*                {dayjs(*/}
      {/*                  notification?.meta?.created_at ||*/}
      {/*                    notification?.created_at*/}
      {/*                ).format("DD MMM")}*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*            <p>{notification?.body ?? ""}</p>*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        <div className="flex justify-end">*/}
      {/*          <Button*/}
      {/*            type="link"*/}
      {/*            className="text-light-green p-0"*/}
      {/*            onClick={() => handleViewMore(notification)}*/}
      {/*          >*/}
      {/*            View More*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  ) : (*/}
      {/*    <Empty description="No new notifications" />*/}
      {/*  )}*/}
      {/*</Modal>*/}

      <Modal
        title={
          <p className="text-lg font-semibold">
            {selectedNotification?.title ?? "Notification Detail"}
          </p>
        }
        open={openDetailModal}
        onCancel={() => setOpenDetailModal(false)}
        footer={null}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "16px" }}
      >
        {selectedNotification ? (
          <div className="space-y-4">
            <p className="text-gray-700">{selectedNotification?.body}</p>

            {selectedNotification?.type === "tribe" && (
              <div className="border rounded-md p-3 space-y-2">
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
                <p>
                  Monetized:{" "}
                  {selectedNotification.meta?.monetized ? "Yes" : "No"}
                </p>
                <p>
                  Private: {selectedNotification.meta?.private ? "Yes" : "No"}
                </p>
              </div>
            )}


            {selectedNotification?.type === "announcement" && (
  <div className="border rounded-md p-3 space-y-2">
    <p className="font-semibold">Announcement Details</p>
    <p>Title: {selectedNotification.meta?.title}</p>
    <p>Content: {selectedNotification.meta?.content}</p>
    <p>
      Scheduled Date:{" "}
      {dayjs(selectedNotification.meta?.date_scheduled).format(
        "DD MMM YYYY, hh:mm A"
      )}
    </p>
    <p>Status: {selectedNotification.meta?.status}</p>
  </div>
)}


{selectedNotification?.type === "connect" && (
  <div className="border rounded-md p-3 space-y-2">
    <p className="font-semibold">Connect Request Details</p>
    <p>
      <span className="font-medium">Message:</span>{" "}
      {selectedNotification.meta?.message}
    </p>
    <p>
      <span className="font-medium">From:</span>{" "}
      {selectedNotification.meta?.user_id}
    </p>
    {/* <p>
      <span className="font-medium">Invitee ID:</span>{" "}
      {selectedNotification.meta?.invitee_id}
    </p> */}
    <p>
      <span className="font-medium">Requested At:</span>{" "}
      {dayjs(selectedNotification.meta?.created_at).format(
        "DD MMM YYYY, hh:mm A"
      )}
    </p>
  </div>
)}


            {selectedNotification?.type === "event" && (
              <div className="border rounded-md p-3 space-y-2">
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
                  {dayjs(selectedNotification.meta?.start_date).format(
                    "DD MMM YYYY, hh:mm A"
                  )}
                </p>
                <p>Location: {selectedNotification.meta?.location}</p>
                <p>
                  Description: {selectedNotification.meta?.event_description}
                </p>
                {selectedNotification.meta?.socials && (
                  <div>
                    <p className="font-semibold">Socials:</p>
                    <ul className="list-disc pl-4">
                      {selectedNotification.meta.socials.map(
                        (s: any, idx: number) => (
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
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Empty description="No details to show" />
        )}
      </Modal>
    </div>
  );
};

export default TopNav;
