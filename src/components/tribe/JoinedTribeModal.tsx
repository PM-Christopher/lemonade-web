import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import CheckedIcon from "@/images/icons/checkedIcon.svg";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {joinTribe} from "@/features/tribes/tribe.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {ColorRing} from "react-loader-spinner";

type JoinTribeInterface = {
    toggle: () => void,
    isOpen: boolean,
    tribe: any
}

const JoinedTribeModal: React.FC<JoinTribeInterface> = ({toggle, isOpen, tribe}) => {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-10 gap-[24px]">
                    <div className="flex justify-center my-6">
                        <div className="flex flex-col items-center w-[544px] gap-[8px]">
                            <p className={'text-[18px] font-semiBold'}>Welcome to</p>
                            <p className="text-center text-[24px] font-normal leading-[21px] font-ruso">
                                {tribe?.tribe_name}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className={'text-center'}>
                            Your payment was successful! You now have full access to all the discussions and content within the Tribe.
                        </p>
                    </div>

                    <div className="flex justify-center bg-light_grey rounded-[12px]">
                        <div className="w-[544px] flex flex-col gap-[20px] p-4 py-[24px]">
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
                    <button
                        className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                        onClick={toggle}
                    >
                        <p className="font-sans font-semi-normal text-[16px] text-white">View tribe</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinedTribeModal;