"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import NotificationSettingsModal from "@/components/settings/Modal/NotificationSettingsModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const NotificationSettingsPage = () => {
    const router = useRouter()
    const { authToken } = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`profile/notification-settings/`, "GET", {}, true, getHeader())
    const [isOpen, setIsOpen] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [notificationSettings, setNotificationSettings] = useState({})

    const renderHeader = () => {
        switch (notificationType) {
            case "new_thread":
                return {
                    title: "New thread in tribe",
                    description: "Notify me when there is a new thread in any tribe I have joined."
                }
            case "thread_engagements":
                return {
                    title: "Thread engagements",
                    description: "Notify me when I have new likes and comments on my threads."
                }
            case "ticket_sales":
                return {
                    title: "Ticket sales",
                    description: "Notify me when I have new ticket sales on events I created."
                }
            case "ticket_payout":
                return {
                    title: "Ticket payout",
                    description: "Notify me when I receive payouts for my events."
                }
            case "service_offer":
                return {
                    title: "Service offer",
                    description: "Notify me when I receive new service offers."
                }
            case "service_status":
                return {
                    title: "Service status",
                    description: "Notify me of updates on active services like payment, progress, and disputes."
                }
            case "service_payout":
                return {
                    title: "Service payout",
                    description: "Notify me when I receive payouts for my completed services."
                }
            case "connect_request":
                return {
                    title: "connect request",
                    description: "Notify me when I get new connect requests"
                }
            case "new_message":
                return {
                    title: "New message",
                    description: "Notify me when I get new messages"
                }
            default:
                return {
                    title: "",
                    description: ""
                }
        }
    }

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const selectNotification = (type: string) => {
        setNotificationType(type)
        setNotificationSettings(data?.app_settings[type])
        toggleModal()
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.push("/settings")}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Notification settings</p>
                    </div>
                </div>
                <section className=" mt-4 flex flex-col items-center">
                    <div className="w-[640px] rounded-[12px] flex flex-col gap-[24px]">
                        <div className="flex flex-col gap-[16px]">
                            <p className="font-semi-normal text-[12px] text-light-black">TRIBE</p>
                            <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">New thread in Tribe</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("new_thread")}/>
                                </div>
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Thread engagements</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("thread_engagements")}/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <p className="font-semi-normal text-[12px] text-light-black">EVENT</p>
                            <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Ticket sales</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("ticket_sales")}/>
                                </div>
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Ticket payout</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("ticket_payout")}/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <p className="font-semi-normal text-[12px] text-light-black">BUSINESS</p>
                            <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Service offer</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("service_offer")}/>
                                </div>
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Service status</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("service_status")}/>
                                </div>
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Service payout</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("service_payout")}/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <p className="font-semi-normal text-[12px] text-light-black">CONNECT</p>
                            <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">Connect request</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("connect_request")}/>
                                </div>
                                <div className="flex justify-between p-[12px] px-[16px] items-center">
                                    <div className="flex flex-col">
                                        <p className="font-semi-normal text-[14px]">New message</p>
                                        <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                    </div>
                                    <ChevronRight className="cursor-pointer"
                                                  onClick={() => selectNotification("new_message")}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <NotificationSettingsModal type={notificationType} renderHeader={renderHeader}
                                           settings={notificationSettings} isOpen={isOpen} toggle={toggleModal}/>
            </section>
        </MainLayout>
    );
}

export default NotificationSettingsPage;