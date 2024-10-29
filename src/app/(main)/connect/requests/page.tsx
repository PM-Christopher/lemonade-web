"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import RequestCard from "@/components/connect/RequestCard";
import InviteModal from "@/components/connect/Modal/InviteModal";
import ConnectModal from "@/components/connect/Modal/ConnectModal";
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const ConnectRequestPage = () => {
    const  router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isConnectOpen, setIsConnectOpen] = useState(false)
    const [inviteIndex, setInviteIndex] = useState<number|null>(null)

    const {authToken, user} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleConnectModal = () => {
        setIsConnectOpen(!isConnectOpen)
    }

    const toggleInviteIndex = (index: number) => {
        setInviteIndex(index)
    }

    const { data, loading } = useRequest("/connect/get-invites", "GET", {}, true, getHeader())

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.push("/connect")}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Connection requests</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-[235px]">
                            <div>
                                <SearchIcon/>
                            </div>
                            <div>
                                <input
                                    id="search"
                                    type="text"
                                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="Search username..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <div
                        className="w-[640px] rounded-[12px] p-[24px] bg-white border-[1px] border-grey-20 max-h-[659px]">
                        <div className="overflow-y-auto max-h-screen hide-scrollbar">
                            {
                                data?.invites?.map((invite: any, index: number) => (
                                    <RequestCard index={index} toggleInviteIndex={toggleInviteIndex} key={index}
                                                 invite={invite} toggle={toggleMenu}/>
                                ))
                            }
                        </div>
                    </div>
                </section>
                {inviteIndex !== null && (
                    <InviteModal invite={data?.invites[inviteIndex]} toggle={toggleMenu} isOpen={isOpen}/>
                )}
                <ConnectModal toggle={toggleConnectModal} isOpen={isConnectOpen}/>
            </section>
        </MainLayout>
    );
}

export default ConnectRequestPage;