import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import * as yup from "yup";
import {useFormik} from "formik";
import {login} from "@/features/authentication/authApi";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import {sendInvite} from "@/features/connect/connect.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type ConnectInterface = {
    toggle: () => void,
    isOpen: boolean,
    user: any
}

const ConnectModal: React.FC<ConnectInterface> = ({toggle, isOpen, user}) => {
    const dispatch = useAppDispatch()
    const { authToken } = useSelector((state: any) => state.auth)
    const connectSchema = yup.object({
        message: yup
            .string()
    });

    const formik = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema: connectSchema,
        onSubmit: async (values) => {
            sendConnect(values)
        },
    })

    const sendConnect = (values: {message: string})  => {
        let data = {...values, invitee_id: user?.id}
        dispatch(sendInvite({token: authToken, data})).then(res => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message,
                        type: "success",
                    })
                );
                formik.resetForm()
                toggle()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message,
                        type: "error",
                    })
                );
                formik.resetForm()
            }
        })
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white rounded-none laptop:rounded-lg shadow-lg w-screen laptop:w-[480px] h-screen laptop:h-full p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon className="w-[11.25px]"/>
                            </div>
                            <p className="font-semibold text-[16px]">Connect</p>
                        </div>
                    </div>
                    <div className="mt-[24px]">
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative">
                                <Image src={'/images/lemon.png'} alt="lemon" width={33} height={41}/>
                                <p className="absolute bottom-3.5 left-2 text-black text-[12px] font-semibold text-center">
                                    L{user?.short_lemon_id}
                                </p>
                            </div>
                            <p className="font-semibold text-[18px]">{user.long_lemon_id}</p>
                            <p className="font-semi-normal text-[14px] text-light-black">{user?.username}</p>
                            <p className="font-normal text-[12px] text-text-grey">{user?.industry}</p>
                            <div className="mt-[16px] flex gap-2 items-center">
                                <LocationIcon/>
                                <p className="font-semi-normal text-mid-green text-[12px]">3kms away</p>
                            </div>
                            <div className="grid gap-2 mt-[24px] w-full">
                                <div className="flex justify-between">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Invite
                                        message</Label>
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[12px] leading-[16.8px] text-text-grey">100
                                        characters</Label>
                                </div>
                                <textarea
                                    className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none p-2 px-4"
                                    placeholder="" onChange={formik.handleChange} value={formik.values.message} name="message" id="message"></textarea>
                            </div>
                            <div className="mt-[32px] w-full">
                                <Button
                                    className="h-[48px] p-[14px] px-[48px] bg-gradient-green rounded-[12px] shadow-custom-bottom w-full">
                                    <p className="font-semi-normal text-[16px]">Send invite</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ConnectModal;