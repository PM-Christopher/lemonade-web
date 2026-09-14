import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import FacebookIcon from "@/images/icons/facebook-color.svg"
import InstagramIcon from "@/images/icons/instagram-color.svg"
import LinkedInIcon from "@/images/icons/linkedin-color.svg"
import TwitterIcon from "@/images/icons/twitter-color.svg"
import WebIcon from "@/images/icons/webIcon.svg"
import ChatIcon from "@/images/icons/chatIcon.svg"
import {formatString, getInitials} from "@/lib/helper";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {useSendInviteMutation} from "@/features/connect/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import Link from "next/link";

type UserInfoInterface = {
    toggle: () => void,
    isOpen: boolean,
    user: any,
    tribe:  TribeInterface | any
}

const UserInfoModal: React.FC<UserInfoInterface> = ({toggle, isOpen, user, tribe}) => {
    const dispatch = useAppDispatch()
    const sendInviteMutation = useSendInviteMutation();

    const sendConnect = ()  => {
        sendInviteMutation.mutate({message: "I want to connect with you.", invitee_id: user?.id}, {
            onSuccess: () => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Connect request sent",
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
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">User Info</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col items-center justify-center">
                        {
                            user?.profile_image ? (
                                <Image
                                    src={user?.profile_image}
                                    alt="check in"
                                    width={64}
                                    height={64}
                                    className="w-[64px] h-[64px] rounded-[24px] border-[1px] border-grey-90"
                                />
                            ) : (
                                <div className="flex items-center justify-center rounded-full border-[2px] border-[#3B4152] w-[40px] h-[40px]
                   text-sm font-medium text-white bg-gradient-green
                   transition-all duration-300 ease-in-out
                   group-hover:scale-110 group-hover:border-green-400
                   group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600"
                                >
                                    <p className="text-[18px] font-ruso">{getInitials(user?.fullname)}</p>
                                </div>
                            )
                        }

                        <p className="font-semibold text-[18px] mt-[16px]">{user?.username}</p>
                        <p className="font-normal text-[12px] text-text-grey">{formatString(user?.industry)}</p>
                        <p className="max-w-[416px] font-normal text-[14px] text-light-black text-center mt-[16px]">
                            {user?.bio}
                        </p>
                        {
                            user?.socials.length > 0 && (
                                <div className="mt-[16px]">
                                    <p className="text-[14px] font-semibold text-center">Social links</p>
                                    <div className="flex gap-[16px] mt-[12px]">
                                        {
                                            user?.socials.map((link: any) => (
                                                <a href={link.value} target="_blank" rel="noopener noreferrer"
                                                   key={link.name}>
                                                    {link.name === 'facebook' && <FacebookIcon className="w-[24px]"/>}
                                                    {link.name === 'instagram' && <InstagramIcon className="w-[24px]"/>}
                                                    {link.name === 'linkedin' && <LinkedInIcon className="w-[24px]"/>}
                                                    {link.name === 'twitter' && <TwitterIcon className="w-[24px]"/>}
                                                    {link.name === 'website' && <WebIcon className="w-[24px]"/>}
                                                </a>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                        {
                            !tribe?.owner && (
                                user?.has_connected ? (
                                    <Link href={"/connect"}>
                                        <div className="mt-[16px]">
                                            <div
                                                className="w-[343px] h-[48px] p-[14px] px-[48px] flex items-center cursor-pointer border-[1px] border-light-grey-50 justify-center gap-[8px] rounded-[12px]">
                                                <ChatIcon/>
                                                <p className="font-semi-normal text-[16px] text-black-light">Open chat</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="mt-[16px]">
                                        <div
                                            className="w-[343px] h-[48px] p-[14px] px-[48px] flex items-center cursor-pointer border-[1px] border-light-grey-50 justify-center gap-[8px] rounded-[12px]" onClick={sendConnect}>
                                            <p className="font-semi-normal text-[16px] text-black-light">Send request</p>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfoModal;