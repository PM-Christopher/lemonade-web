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
import {getInitials} from "@/lib/helper";
import {TribeDetailsSkeleton} from "@/components/Skeletons";

type TribeDetailsInterface = {
    toggle: () => void,
    toggleJoin: () => void,
    tribe: TribeInterface | null,
    share: (tribe: TribeInterface|null) => void
    toggleAddMember: () => void,
    threads: any
}
const TribeDetailsCard: React.FC<TribeDetailsInterface> = ({
                                                               toggle,
                                                               tribe,
                                                               share,
                                                               toggleAddMember,
                                                               toggleJoin,
                                                               threads
                                                           }) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const {loading: tribeLoading} = useSelector((state: any) => state.tribe);

    const handleJoinTribe = (id: string) => {
        const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/tribe/${id}`;
        dispatch(joinTribe({token: authToken, id, data: {redirect_url}})).then((res: any) => {
            if (res.payload.data.authorization_url) {
                window.location.href = res.payload.data.authorization_url;
            } else {
                toggleJoin()
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Joined tribe successfully",
                        type: "success",
                    })
                );
            }
        })
    }

    return (
        <>
            {
                tribeLoading ? (
                    <TribeDetailsSkeleton/>
                ) : (
                    <div className="flex flex-col gap-2 p-4 py-4 bg-white w-[496px] h-fit rounded-[12px]">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px]">Tribe details</p>
                        </div>
                        <div className="flex justify-center mt-10">
                            <div className="w-[96px] h-[96px] rounded-[24px] overflow-hidden border-[2px]">
                                <Image
                                    src={tribe?.image || "/images/placeholder.png"} // fallback
                                    alt="tribe"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-fill"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-sans font-semibold text-[16px] leading-[24px]">
                                {tribe?.tribe_name}
                            </p>

                            <i className="font-sans font-semi-normal text-[14px] leading-[16.8px] text-text-grey mt-1">
                                {tribe?.category}
                            </i>

                            <div className="flex gap-1 justify-center items-center mt-1">
                                <p className="font-sans font-normal text-[12px] text-text-grey">{tribe?.members} members</p>

                                <DotIcon className="w-[3px] h-[3px]"/>

                                <p className="font-sans font-normal text-[12px] text-text-grey">{threads.length} threads</p>
                            </div>

                            <div className="flex flex-col items-center w-[311px]">
                                <>
                                    <p className="text-center font-sans font-normal text-light-black text-[14px] leading-[21px] my-4">
                                        {tribe?.description}
                                    </p>
                                    <p className="font-sans font-normal text-[12px] text-text-grey my-2">
                                        Created by <span
                                        className="font-semibold">{tribe?.created_by}</span> on {formatLongDate(tribe?.created_at)}
                                    </p>
                                </>
                            </div>

                            <div className="flex gap-[16px]">
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => share(tribe)}>
                                    <div className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                                        <ShareIcon/>
                                    </div>
                                    <p className="text-black-light text-[14px] font-semi-normal font-sans leading-[21px]">Share</p>
                                </div>

                                {tribe?.owner && (
                                    <div className="flex flex-col items-center cursor-pointer"
                                         onClick={toggleAddMember}>
                                        <div
                                            className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                                            <AddUserIcon/>
                                        </div>
                                        <p className="text-black-light text-[14px] font-semi-normal font-sans leading-[21px]">Add
                                            member</p>
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
                                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Create
                                                thread</p>
                                        </div>
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-gradient-green border-step-color shadow-custom-bottom h-[60px] p-[14px] px-[24px] rounded-[37px]"
                                        onClick={toggleJoin}
                                    >
                                        <div className="flex gap-1 justify-center">
                                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Join
                                                tribe</p>
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
                                        <p className="font-sans font-normal text-[12px] text-text-grey leading-[14.4px]">Only
                                            paid user
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
                                                        {/*<Image src={member?.user?.avatar} alt="avatar" width={20} height={20} className="w-[20px] h-[20px] rounded-[6px]"/>*/}
                                                        <div
                                                            className="w-[20px] h-[20px] rounded-[6px] overflow-hidden flex items-center justify-center bg-gray-200 text-[10px] font-semibold text-gray-700">
                                                            {member?.user?.avatar ? (
                                                                <Image
                                                                    src={member.user.avatar}
                                                                    alt="avatar"
                                                                    width={20}
                                                                    height={20}
                                                                    className="w-[20px] h-[20px] object-cover"
                                                                />
                                                            ) : (
                                                                getInitials(member?.user?.fullname)
                                                            )}
                                                        </div>
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
                )
            }
        </>
    );
}

export default TribeDetailsCard;