"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PadlockIcon from "@/images/icons/padlockIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import TrashIcon from "@/images/icons/trashIcon.svg";
import LogoutIcon from "@/images/icons/logoutIcon.svg";
import UpdatePasswordModal from "@/components/settings/Modal/UpdatePasswordModal";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import {logout} from "@/features/authentication/authSlice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";

const AccountSettingsPage = () => {
    const dispatch = useAppDispatch()
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)
    const router = useRouter()
    const { user, authToken: token } = useSelector((state: any) => state.auth)

    const toggleSettingsModal = () => {
        setPasswordModalOpen(!isPasswordModalOpen)
    }

    const handleLogout = () => {
        dispatch(logout({token})).then(res => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: `Logged out`,
                        type: "success",
                    })
                );
                // redirect user to login
                router.push("/login")
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message || `Something went wrong`,
                        type: "error",
                    })
                );
            }
        })
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Account settings</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col px-5 items-center">
                    <div className="w-full laptop:w-[640px] rounded-[12px] p-[16px] flex flex-col bg-white gap-4">
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
                            <ChevronRight className="cursor-pointer"
                                          onClick={() => router.push("/settings/account/delete-account")}/>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-[8px] items-center">
                                <LogoutIcon/>
                                <p className="font-normal text-[16px] text-red-1">Log out</p>
                            </div>
                            <ChevronRight className="cursor-pointer" onClick={handleLogout}/>
                        </div>
                    </div>
                </section>
                <UpdatePasswordModal user={user} toggle={toggleSettingsModal} isOpen={isPasswordModalOpen}/>
            </section>
        </MainLayout>
    );
}

export default AccountSettingsPage;