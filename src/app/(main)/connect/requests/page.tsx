"use client";
import React, {useEffect, useState} from "react";
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
import {findUser, getInvites} from "@/features/connect/connect.slice";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {RootState} from "@/redux/store";
import {InviteSkeleton} from "@/components/Skeletons";

const ConnectRequestPage = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const [inviteIndex, setInviteIndex] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    const {user: connUser, invites, loading} = useSelector((state: RootState) => state.chat);

    const {authToken, user} = useSelector((state: any) => state.auth);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleConnectModal = () => {
        setIsConnectOpen(!isConnectOpen);
    };

    const toggleInviteIndex = (index: number) => {
        setInviteIndex(index);
    };

    const {getData} = useRequest(
        "/connect/get-invites",
    );

    useEffect(() => {
        dispatch(getInvites())
    }, [])

    const handleSearch = (e: any) => {
        if (e.key === "Enter") {
            if (e.currentTarget.value !== "") {
                // Trigger your desired function here
                console.log(
                    "Enter key pressed, search triggered",
                    e.currentTarget.value
                );
                // find user
                dispatch(
                    findUser({token: authToken, search: e.currentTarget.value})
                ).then((res) => {
                    if (res.payload.status) {
                        dispatch(
                            updateToastifyReducer({
                                show: true,
                                message: "User found",
                                type: "success",
                            })
                        );
                        e.target.value = "";
                        toggleConnectModal();
                    } else {
                        dispatch(
                            updateToastifyReducer({
                                show: true,
                                message: res.payload.message,
                                type: "error",
                            })
                        );
                    }
                });
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Please enter a user name to proceed",
                        type: "error",
                    })
                );
            }
        }
    };

    return (
        <MainLayout>
            <section className="bg-white laptop:bg-light_grey pb-10">
                <div
                    className="bg-white flex flex-col laptop:flex-row justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-start laptop:items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                        onClick={() => router.push("/connect")}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Connection requests
                        </p>
                    </div>
                    <div className="flex gap-2 items-center w-full laptop:w-fit relative group">
                        {/* Search Container */}
                        <div
                            className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full laptop:w-[235px] h-[40px]">
                            <div>
                                <SearchIcon/>
                            </div>
                            <div className="w-full relative">
                                <input
                                    id="search"
                                    type="text"
                                    className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-[10px]"
                                    placeholder="Search username..."
                                    onKeyDown={(e) => handleSearch(e)}
                                />

                                {/* Tooltip */}
                                <div
                                    className="absolute left-0 mt-1 w-max bg-gray-800 text-white text-[12px] rounded-md px-2 py-1 opacity-0 translate-y-1 transition-all duration-300 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-y-0"
                                >
                                    Press <span className="font-semibold">Enter</span> to search
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div
                        className="w-screen laptop:w-[800px] rounded-[12px] p-[24px] bg-white border-none laptop:border-[1px] laptop:border-grey-20 max-h-[659px]">
                        <div className="overflow-y-auto max-h-screen hide-scrollbar">
                            {
                                loading ? (
                                    <InviteSkeleton count={4} />
                                ) : (
                                    invites.length > 0 ? (
                                        invites?.map((invite: any, index: number) => (
                                            <RequestCard
                                                index={index}
                                                toggleInviteIndex={toggleInviteIndex}
                                                key={index}
                                                invite={invite}
                                                toggle={toggleMenu}
                                                user={user}
                                            />
                                        ))
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-[16px]">No request found</p>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </section>
                {inviteIndex !== null && (
                    <InviteModal
                        invite={invites[inviteIndex]}
                        toggle={toggleMenu}
                        isOpen={isOpen}
                        reloadFunc={getData}
                    />
                )}
                {connUser && (
                    <ConnectModal
                        users={connUser}
                        toggle={toggleConnectModal}
                        isOpen={isConnectOpen}
                        reloadFunc={getData}
                        authUser={user}
                    />
                )}
            </section>
        </MainLayout>
    );
};

export default ConnectRequestPage;
