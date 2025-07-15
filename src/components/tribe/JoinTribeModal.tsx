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

const JoinTribeModal: React.FC<JoinTribeInterface> = ({toggle, isOpen, tribe}) => {

    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const {loading: tribeLoading} = useSelector((state: any) => state.tribe);

    const handleJoinTribe = (id: string) => {
        const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/tribe/${id}`;
        dispatch(joinTribe({token: authToken, id, data: {redirect_url}})).then((res:any) => {
            if (res.payload.data.authorization_url) {
                window.location.href = res.payload.data.authorization_url;
            }
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Joined tribe successfully",
                    type: "success",
                })
            );
        })
    }

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
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            onClick={() => handleJoinTribe(tribe.slug)}
                            disabled={tribeLoading}
                        >
                            {
                                tribeLoading ? (
                                    <ColorRing
                                        visible={true}
                                        height="30"
                                        width="30"
                                        ariaLabel="color-ring-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="color-ring-wrapper"
                                        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                                    />
                                ) : (
                                    <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Join Tribe now</p>
                                )
                            }
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <div className="flex justify-center">
                        <div
                            className="w-[544px] flex flex-col items-center bg-light-green-10 p-[16px] border-2 border-step-color rounded-[12px]">
                            <p className="font-sans font-semi-normal text-[14px] leading-[21px]">Membership
                                fee</p>
                            <p className="mt-2 font-sans font-semibold text-[24px] leading-[33.6px]">
                                N {formatNumberWithCommas(tribe?.membership_fee)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center my-6">
                        <div className="flex justify-center w-[544px]">
                            <p className="text-center text-[14px] font-sans font-semibold leading-[21px]">
                                {tribe?.tribe_name} <span className="font-semi-normal">offers exclusive content and discussions
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