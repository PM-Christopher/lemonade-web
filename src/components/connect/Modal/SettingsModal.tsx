"use client"
import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import Switch from "react-switch";
import {axiosInstance} from "@/lib/axiosInstane";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type SettingsInterface = {
    toggle: () => void,
    isOpen: boolean,
    user_connect: any
}

const SettingsModal: React.FC<SettingsInterface>= ({toggle, isOpen, user_connect}) => {
    const dispatch = useAppDispatch()
    const [checked, setChecked] = useState(user_connect?.user?.visibility ?? false)
    const {authToken, user} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const handleChange = async () => {
        const { data } = await axiosInstance.patch("/connect/update-visibility", {visibility: !checked}, getHeader());
        if (data.status) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: data.message,
                    type: "success",
                })
            );
            setChecked(!checked)
            toggle()
        } else {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Something went wrong",
                    type: "error",
                })
            );
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-none laptop:rounded-lg shadow-lg w-screen laptop:w-[480px] h-screen laptop:h-[40vh] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">Visibility settings</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <div className="pt-[12px] pb-[12px] rounded-[12px] bg-light-green-10 w-full flex flex-col items-center justify-center">
                            <div className="relative">
                                <Image src={"/images/lemon.png"} alt="lemon" width={33} height={41}/>
                                <p className="absolute bottom-3.5 left-2 text-black text-[12px] font-semibold text-center">
                                    {user_connect?.user?.lemon_id_short}
                                </p>
                            </div>
                            <p className="font-semibold text-[18px]">
                                {user_connect?.user?.lemon_id_full}
                            </p>
                        </div>
                        <div className="mt-[32px] flex justify-between">
                            <div className="flex flex-col">
                                <p className="font-semibold text-[16px]">Turn on visibility</p>
                                <p className="font-semi-normal text-[12px] text-text-grey">Your live location will be
                                    visible to everybody</p>
                            </div>
                            <div>
                                <Switch onChange={(change) => {
                                    handleChange()
                                }} checked={checked} checkedIcon={false} uncheckedIcon={false} onColor="#9BE303"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;