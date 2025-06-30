import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import {Button} from "@/components/ui/button";
import {formatStringUCFirst} from "@/lib/helper";
import {useAppDispatch} from "@/redux/hook";
import {inviteResponse} from "@/features/connect/connect.slice";
import {useSelector} from "react-redux";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type InviteInterface = {
    toggle: () => void,
    isOpen: boolean,
    invite: any
    reloadFunc: any
}

const InviteModal: React.FC<InviteInterface> = ({toggle, isOpen, invite, reloadFunc}) => {
    const dispatch = useAppDispatch()
    const {authToken, user} = useSelector((state: any) => state.auth)

    const requestAction = (action: string) => {
        dispatch(inviteResponse({token: authToken, data: {option:action}, id: invite.id})).then((res) => {
            console.log(res)
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message,
                        type: "success",
                    })
                );
                toggle()

                reloadFunc()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.payload.message || "Something went wrong",
                        type: "error",
                    })
                );
            }
        })
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-none laptop:rounded-lg shadow-lg w-full laptop:w-[480px] p-6 h-screen laptop:h-auto laptop:max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">New Invite</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col justify-between min-h-[calc(100vh-120px)] laptop:min-h-0">
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative flex items-center justify-center">
                                <Image src={'/images/lemon.png'} alt="lemon" width={33} height={41}/>
                                <p className="absolute text-black text-[12px] font-semibold text-center">
                                    {invite?.invitee?.lemon_id_short}
                                </p>
                            </div>
                            <p className="font-semibold text-[18px]">{invite?.invitee?.lemon_id_full}</p>
                            <p className="font-semi-normal text-[14px] text-light-black">{invite?.invitee?.username}</p>
                            <p className="font-normal text-[12px] text-text-grey">{formatStringUCFirst(invite?.invitee?.industry)}</p>
                            <div className="mt-[16px] flex gap-2 items-center">
                                <LocationIcon/>
                                <p className="font-semi-normal text-mid-green text-[12px]">3kms away</p>
                            </div>
                            <div className="flex flex-col p-[16px] bg-light_grey mt-[32px] rounded-[12px]">
                                <p className="font-semi-normal text-[12px] text-text-grey">Message</p>
                                <p className="font-normal text-[14px] text-light-black max-w-[384px] mt-[8px]">
                                    {invite?.message}
                                </p>
                            </div>
                        </div>
                        <div className="mt-[32px] flex justify-between gap-[16px]">
                            <Button
                                className="h-[48px] p-[14px] px-[48px] border-[1px] border-light-grey-50 bg-white rounded-[12px] w-full"
                                onClick={() => requestAction("rejected")}>
                                <p className="font-semi-normal text-[16px] text-black-light">Reject invite</p>
                            </Button>
                            <Button
                                className="h-[48px] p-[14px] px-[48px] bg-gradient-green rounded-[12px] shadow-custom-bottom w-full"
                                onClick={() => requestAction("accepted")}>
                                <p className="font-semi-normal text-[16px]">Accept invite</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InviteModal;