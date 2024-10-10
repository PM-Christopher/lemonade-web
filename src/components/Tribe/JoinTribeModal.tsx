import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import {Button} from "@/components/ui/button";
import CheckedIcon from "@/image/icons/CheckedIcon.svg";

type JoinTribeInterface = {
    toggle: () => void,
    isOpen: boolean
}

const JoinTribeModal: React.FC<JoinTribeInterface> = ({toggle, isOpen}) => {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px]">Unlock Exclusive
                            content!</p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom">
                            <p className="font-sans font-semi-normal text-[12px]">Join Tribe now</p>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <div className="flex justify-center">
                        <div
                            className="w-[544px] flex flex-col items-center bg-light-green-10 p-[16px] border-2 border-step-color rounded-[12px]">
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px]">Membership
                                fee</p>
                            <p className="mt-2 font-sans font-semibold text-[24px] leading-[33.6px]">₦2,000</p>
                        </div>
                    </div>

                    <div className="flex justify-center my-6">
                        <div className="flex justify-center w-[544px]">
                            <p className="text-center text-[14px] font-sans font-semibold leading-[21px]">Architecture
                                Tribe <span className="font-semi-normal">offers exclusive content and discussions
                                    for a membership fee set by the Tribe creator. Join now and enjoy this exclusive
                                    benefits</span></p>
                        </div>
                    </div>

                    <div className="flex justify-center bg-light_grey rounded-[12px]">
                        <div className="w-[544px] flex flex-col gap-4 p-4 py-[24px]">
                            <div className="flex items-center gap-4">
                                <CheckedIcon/>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px]">Access to
                                    in-depth content</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckedIcon/>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px]">Gain
                                    valuable knowledge</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckedIcon/>
                                <p className="font-sans font-semi-normal text-[14px] leading-[21px]">Connect
                                    with your community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinTribeModal;