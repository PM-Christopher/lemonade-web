"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import PadlockIcon from "@/image/icons/PadlockIcon.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import TrashIcon from "@/image/icons/TrashIcon.svg";
import LogoutIcon from "@/image/icons/LogoutIcon.svg";
import UpdatePasswordModal from "@/components/Settings/Modal/UpdatePasswordModal";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";

const AccountSettingsPage = () => {
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)
    const router = useRouter()
    const { user } = useSelector((state: any) => state.auth)

    const toggleSettingsModal = () => {
        setPasswordModalOpen(!isPasswordModalOpen)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer" onClick={() => router.back()}>
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Account settings</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="w-[640px] rounded-[12px] p-[16px] flex flex-col bg-white gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-[8px] items-center">
                            <PadlockIcon/>
                            <p className="font-normal text-[16px]">Update Password</p>
                        </div>
                        <ChevronRight className="cursor-pointer" onClick={toggleSettingsModal}/>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-[8px] items-center">
                            <TrashIcon/>
                            <p className="font-normal text-[16px]">Delete account</p>
                        </div>
                        <ChevronRight className="cursor-pointer" onClick={() => router.push("/settings/account/delete-account")} />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-[8px] items-center">
                            <LogoutIcon/>
                            <p className="font-normal text-[16px] text-red-1">Log out</p>
                        </div>
                        <ChevronRight/>
                    </div>
                </div>
            </section>
            <UpdatePasswordModal user={user} toggle={toggleSettingsModal} isOpen={isPasswordModalOpen} />
        </section>
    );
}

export default AccountSettingsPage;