import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import {Button} from "@/components/ui/button";
import {formatStringUCFirst, getDistanceFromLatLonInKm} from "@/lib/helper";
import {useAppDispatch} from "@/redux/hook";
import {useInviteResponseMutation} from "@/features/connect/mutations";
import {useSelector} from "react-redux";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type InviteInterface = {
    toggle: () => void,
    isOpen: boolean,
    invite: any
}

const InviteModal: React.FC<InviteInterface> = ({toggle, isOpen, invite}) => {
    const dispatch = useAppDispatch()
    const {user} = useSelector((state: any) => state.auth)
    const inviteResponseMutation = useInviteResponseMutation();

    const requestAction = (action: "accepted" | "rejected") => {
        inviteResponseMutation.mutate({id: invite.id, option: action}, {
            onSuccess: (res) => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: res.message,
                        type: "success",
                    })
                );
                toggle()
            },
            onError: (err: any) => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.message || "Something went wrong",
                        type: "error",
                    })
                );
            },
        })
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100 visible bg-gray-800/50" : "opacity-0 invisible"}`}
        >
            <div
                className="bg-white rounded-none laptop:rounded-lg shadow-2xl w-full laptop:w-[480px] p-6 h-screen laptop:h-auto laptop:max-h-[90vh] overflow-y-auto
               flex flex-col justify-between hide-scrollbar"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-100 transition-all"
                            onClick={toggle}
                        >
                            <CloseIcon className="w-[12px]"/>
                        </button>
                        <p className="font-semibold text-[16px] text-gray-900">New Invite</p>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-col items-center text-center space-y-3">
                    {/* Avatar */}
                    <div
                        className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full overflow-hidden bg-gray-100">
                        <Image
                            src="/images/lemon.png"
                            alt="lemon"
                            fill
                            className="object-contain"
                        />
                        <p className="absolute inset-0 flex items-center justify-center text-black text-[12px] font-semibold">
                            {invite?.invitee?.lemon_id_short}
                        </p>
                    </div>

                    {/* User Info */}
                    <p className="font-semibold text-[18px] text-gray-900">
                        {invite?.invitee?.lemon_id_full}
                    </p>
                    <p className="text-[14px] text-gray-700">{invite?.invitee?.username}</p>
                    {invite?.invitee?.bio && (
                        <p className="text-[14px] text-gray-700">{invite?.invitee?.bio}</p>
                    )}
                    {invite?.invitee?.industry && (
                        <p className="text-[12px] text-gray-500">{formatStringUCFirst(invite?.invitee?.industry)}</p>
                    )}

                    {/* Distance */}
                    <div className="flex items-center gap-2 mt-2 text-[12px] text-mid-green">
                        <LocationIcon/>
                        <p>
                            {getDistanceFromLatLonInKm(
                                user?.connect_info?.latitude,
                                user?.connect_info?.longitude,
                                invite?.location?.latitude,
                                invite?.location?.longitude
                            )}{" "}
                            kms away
                        </p>
                    </div>

                    {/* Message */}
                    {invite?.message && (
                        <div className="flex flex-col p-4 bg-light_grey rounded-lg mt-4 w-full max-w-[384px]">
                            <p className="text-[12px] text-gray-500 font-medium">Message</p>
                            <p className="text-[14px] text-gray-800 mt-1">{invite?.message}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4 w-full">
                    <Button
                        className="flex-1 h-[48px] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        onClick={() => requestAction("rejected")}
                    >
                        <p className="text-[16px] text-gray-900 font-medium">Reject Invite</p>
                    </Button>
                    <Button
                        className="flex-1 h-[48px] bg-gradient-green rounded-lg shadow-lg hover:brightness-105 transition-all"
                        onClick={() => requestAction("accepted")}
                    >
                        <p className="text-[16px] font-medium">Accept Invite</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InviteModal;