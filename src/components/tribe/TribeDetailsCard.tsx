import React from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import ShareIcon from "@/images/icons/share.svg";
import AddUserIcon from "@/images/icons/addUserIcon.svg"
import {Button} from "@/components/ui/button";
import EditIcon from "@/images/icons/edit.svg";
import DeleteIcon from "@/images/icons/delete.svg";
import {TribeInterface, TribeMemberInterface} from "@/interfaces/TribeInterface";
import {formatLongDate} from "@/lib/dateTimeFormatter";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {joinTribe} from "@/features/tribes/tribe.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {ColorRing} from "react-loader-spinner";
import SkeletonLoader from "@/components/global/SkeletonLoader";

type TribeDetailsInterface = {
    toggle: () => void,
    tribe: TribeInterface,
    share: (tribe: TribeInterface) => void
    toggleAddMember: () => void,
}
const TribeDetailsCard: React.FC<TribeDetailsInterface> = ({toggle, tribe, share, toggleAddMember}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const {loading: tribeLoading} = useSelector((state: any) => state.tribe);

    const handleJoinTribe = (id: string) => {
        dispatch(joinTribe({token: authToken, id})).then((res:any) => {
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
        <div className="flex flex-col gap-2 p-4 py-4 bg-white w-[496px] h-fit rounded-[12px]">
            <div>
                <p className="font-sans font-semibold text-[16px] leading-[24px]">Tribe details</p>
            </div>
            <div className="flex justify-center mt-10">
                {tribeLoading ? (
                    <SkeletonLoader className="h-[96px] w-[96px] rounded" />
                ) : (
                    <Image src={tribe?.image} alt="tribe" width={96} height={96} className="rounded-[24px] h-[96px]"/>
                )}
            </div>
            <div className="flex flex-col items-center">
                {tribeLoading ? (
                    <SkeletonLoader className="h-[24px] w-[150px] rounded" />
                ) : (
                    <p className="font-sans font-semibold text-[16px] leading-[24px]">
                        {tribe?.tribe_name}
                    </p>
                )}

                {tribeLoading ? (
                    <SkeletonLoader className="h-[16px] w-[100px] rounded mt-1" />
                ) : (
                    <i className="font-sans font-semi-normal text-[14px] leading-[16.8px] text-text-grey mt-1">
                        {tribe?.category}
                    </i>
                )}

                <div className="flex gap-1 justify-center items-center mt-1">
                    {tribeLoading ? (
                        <SkeletonLoader className="h-[12px] w-[80px] rounded" />
                    ) : (
                        <p className="font-sans font-normal text-[12px] text-text-grey">{tribe?.members} members</p>
                    )}

                    {!tribeLoading && <DotIcon className="w-[3px] h-[3px]" />}

                    {tribeLoading ? (
                        <SkeletonLoader className="h-[12px] w-[60px] rounded" />
                    ) : (
                        <p className="font-sans font-normal text-[12px] text-text-grey">{tribe?.threads} threads</p>
                    )}
                </div>

                <div className="flex flex-col items-center w-[311px]">
                    {tribeLoading ? (
                        <>
                            <SkeletonLoader className="h-[84px] w-full rounded my-4" />
                            <SkeletonLoader className="h-[16px] w-[180px] rounded my-2" />
                        </>
                    ) : (
                        <>
                            <p className="text-center font-sans font-normal text-light-black text-[14px] leading-[21px] my-4">
                                {tribe?.description}
                            </p>
                            <p className="font-sans font-normal text-[12px] text-text-grey my-2">
                                Created by <span className="font-semibold">{tribe?.created_by}</span> on {formatLongDate(tribe?.created_at)}
                            </p>
                        </>
                    )}
                </div>

                <div className="flex gap-[16px]">
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => share(tribe)}>
                        <div className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                            {tribeLoading ? <SkeletonLoader className="h-[24px] w-[24px] rounded-full" /> : <ShareIcon />}
                        </div>
                        <p className="text-black-light text-[14px] font-semi-normal font-sans leading-[21px]">Share</p>
                    </div>

                    {(!tribeLoading && tribe?.owner) && (
                        <div className="flex flex-col items-center cursor-pointer" onClick={toggleAddMember}>
                            <div className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                                <AddUserIcon />
                            </div>
                            <p className="text-black-light text-[14px] font-semi-normal font-sans leading-[21px]">Add member</p>
                        </div>
                    )}

                    {tribeLoading && (
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                                <SkeletonLoader className="h-[24px] w-[24px] rounded-full" />
                            </div>
                            <SkeletonLoader className="h-[21px] w-[80px] rounded mt-2" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center my-2">
                {
                    tribe?.has_joined || tribe?.owner ? (
                        <Button
                            className="bg-gradient-green border-step-color shadow-custom-bottom h-[60px] p-[14px] px-[24px] rounded-[37px]"
                            onClick={toggle}>
                            <div className="flex gap-1 justify-center items-center">
                                <EditIcon/>
                                <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Create thread</p>
                            </div>
                        </Button>
                    ) : (
                        <Button
                            className="bg-gradient-green border-step-color shadow-custom-bottom h-[60px] p-[14px] px-[24px] rounded-[37px]"
                            onClick={() => handleJoinTribe(tribe?.slug)}
                            disabled={tribeLoading}
                        >
                            <div className="flex gap-1 justify-center">
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
                                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Join tribe</p>
                                    )
                                }
                            </div>
                        </Button>
                    )
                }
            </div>
            {
                tribe?.monetized ? (
                    <div className="flex justify-between items-center my-4">
                        <div className="flex flex-col">
                            <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">Monetized
                                Tribe</p>
                            <p className="font-sans font-normal text-[12px] text-text-grey leading-[14.4px]">Only paid user
                                are
                                allowed.</p>
                        </div>
                        <div>
                            <p className="font-sans font-semi-normal text-light-black text-[14px] leading-[21px]">N {formatNumberWithCommas(tribe?.membership_fee)}</p>
                        </div>
                    </div>
                ) : (<></>)
            }
            <div className="flex flex-col p-3 bg-light_grey rounded-[12px]">
                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">Members</p>
                <div className="mt-4">
                    {
                        tribe?.member_list.map((member: TribeMemberInterface, index: number) => (
                            <React.Fragment key={index}>
                                <div className="flex justify-between items-center py-1">
                                    <div className="flex gap-2 items-center">
                                    <div>
                                            <Image src={member?.user?.avatar} alt="avatar" width={20} height={20} className="w-[20px] h-[20px] rounded-[6px]"/>
                                        </div>
                                        <div>
                                            <p className="font-sans font-semi-normal text-[14px] text-black-light leading-[21px]">{member?.user?.username}</p>
                                        </div>
                                    </div>
                                    {
                                        tribe?.owner && (
                                            <div>
                                                <DeleteIcon/>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="border-t-[1px] my-2"></div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default TribeDetailsCard;