import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import Lemon from "@/image/Lemon.png";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import SearchIcon from "@/image/icons/search.svg";
import EyeIcon from "@/image/icons/EyeIcon.svg"

type UpdatePasswordInterface = {
    toggle: () => void,
    isOpen: boolean
}

const UpdatePasswordModal: React.FC<UpdatePasswordInterface> = ({toggle, isOpen}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">Update password</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <div className="grid gap-1 mt-[24px]">
                            <Label htmlFor="username"
                                   className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Current
                                password</Label>
                            <div className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                <div>
                                    <input
                                        id="search"
                                        type="password"
                                        className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                        placeholder=""
                                    />
                                </div>
                                <EyeIcon/>
                            </div>
                        </div>
                        <div className="grid gap-1 mt-[24px]">
                            <Label htmlFor="username"
                                   className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">New
                                Password</Label>
                            <div
                                className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                <div>
                                    <input
                                        id="search"
                                        type="password"
                                        className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                        placeholder=""
                                    />
                                </div>
                                <EyeIcon/>
                            </div>
                            <p className="font-normal text-grey-40 text-[12px]">Password must be at least 8 character
                                long</p>
                        </div>
                        <div className="grid gap-1 mt-[24px]">
                            <Label htmlFor="username"
                                   className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Confirm
                                password</Label>
                            <div
                                className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                                <div>
                                    <input
                                        id="search"
                                        type="password"
                                        className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                        placeholder=""
                                    />
                                </div>
                                <EyeIcon/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePasswordModal;