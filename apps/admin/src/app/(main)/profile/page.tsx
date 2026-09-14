"use client"
import React from 'react';
import MainLayout from "@/components/layouts/MainLayout";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAdminProfileQuery} from "@/features/profile/queries";

function ProfilePage({}) {

    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const { data } = useAdminProfileQuery({ enabled: isLoggedIn });
    const profile = data?.admin;

    return (
        <MainLayout>
            <section className={"p-[20px] flex justify-between"}>
                <div className={"w-[588px] h-fit bg-white flex flex-col rounded-[12px] gap-[12px]"}>
                    <div className={'flex flex-col p-[24px] gap-[20px]'}>
                        <div className={'w-[64px] h-[64px] bg-mid-grey rounded-full'}></div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
                            </div>
                            <p className={"text-[14px] font-medium"}>{profile?.name}</p>
                        </div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
                            </div>
                            <p className={"text-[14px] font-medium"}>{profile?.unique_id}</p>
                        </div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
                            </div>
                            <p className={"text-[14px] font-medium  text-light-green-70"}>{profile?.status === 1 ? "Active" : "Suspended"}</p>
                        </div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
                            </div>
                            <div className={"flex gap-[4px]"}>
                                <p className={"text-[14px] font-medium"}>{profile?.role.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
                            </div>
                            <div className={"flex gap-[4px]"}>
                                <p className={"text-[14px] font-medium"}>{profile?.email}</p>
                            </div>
                        </div>
                        <div className={"flex gap-[24px] items-center-center"}>
                            <div className={"w-[115px]"}>
                                <p className={"text-text-grey text-[12px] font-medium"}>Date Address:</p>
                            </div>
                            <p className={"text-[14px] font-medium"}>{profile?.created_at}</p>
                        </div>
                        <button
                            className={'px-[48px] py-[11px] border-[1px] rounded-[12px] border-light-grey-50 w-fit font-sans font-medium text-[14px]'}
                            type={'button'}>Update password
                        </button>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

export default ProfilePage;