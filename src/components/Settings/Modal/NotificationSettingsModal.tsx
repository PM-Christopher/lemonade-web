"use client"
import React, {useEffect, useState} from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Switch from "react-switch";
import {useAppDispatch} from "@/redux/hook";
import {updateAppSettings} from "@/features/authentication/authSlice";
import {useSelector} from "react-redux";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type NotificationSettingsInterface = {
    toggle: () => void,
    isOpen: boolean,
    settings: any,
    renderHeader: any,
    type: any
}

const NotificationSettingsModal: React.FC<NotificationSettingsInterface> = ({toggle, isOpen, settings, renderHeader, type}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const [emailChecked, setEmailChecked] = useState(false)
    const [inAppChecked, setInAppChecked] = useState(false)

    const handleChange = (type: string) => {
        if (type === "email") {
            setEmailChecked((prev) => !prev);
        } else if (type === "in-app") {
            setInAppChecked((prev) => !prev);
        }
        handleUpdateSettings(type);
    };

    const handleUpdateSettings = (s_type: string) => {
        const data = {
            type,
            settings: {
                email: s_type === "email" ? !emailChecked : emailChecked,
                in_app_notification: s_type === "in-app" ? !inAppChecked : inAppChecked,
            }
        };
        dispatch(updateAppSettings({token: authToken, data})).then((res) => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "App Settings Updated",
                        type: "success",
                    })
                );
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
        })
    };

    useEffect(() => {
        setEmailChecked(settings.email)
        setInAppChecked(settings.in_app_notification)
    }, [settings]);

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-[16px]">{renderHeader()?.title}</p>
                            <p className="text-text-grey font-normal text-[14px]">{renderHeader()?.description}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex justify-between items-center">
                            <p className="font-normal text-[16px]">In-app notification</p>
                            <Switch onChange={(change) => {
                                handleChange("in-app")
                            }} checked={inAppChecked} checkedIcon={false} uncheckedIcon={false} onColor="#9BE303"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-normal text-[16px]">Email</p>
                            <Switch onChange={(change) => {
                                handleChange("email")
                            }} checked={emailChecked} checkedIcon={false} uncheckedIcon={false} onColor="#9BE303"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationSettingsModal;