import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/dot.svg";
import ClockIcon from "@/images/icons/clock-orange.svg";
import {GuestDetailSkeleton} from "@/components/Skeletons";
import {formatStringUCFirst} from "@/lib/helper";
import {useAppDispatch} from "@/redux/hook";
import CheckedInModal from "@/components/events/Modals/CheckedInModal";
import {checkInGuest} from "@/features/events/event.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {ColorRing} from "react-loader-spinner";
import CheckIcon from "@/images/icons/checkedFilledIcon.svg"

type SideMenuInterface = {
    toggleMenu: () => void,
    isOpen: boolean,
    guestDetails: any,
    loading: boolean,
    id: number
}

const GuestSideMenu: React.FC<SideMenuInterface> = ({toggleMenu, isOpen, guestDetails, loading, id}) => {
    const dispatch = useAppDispatch()
    const {checkInLoading} = useSelector((state: RootState) => state.event)
    const [checkedInOpen, setCheckedInOpen] = useState(false)

    const toggleModal = () => {
        setCheckedInOpen(!checkedInOpen)
    }

    const handleCheckInGuest = () => {
        dispatch(checkInGuest({id, guest_id: guestDetails?.id})).then((res: any) => {
            if (res.payload.status) {
                toggleMenu()
                toggleModal()
            }
        }).catch((err: any) => {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: `There was an error while checking the guest is`,
                    type: "error",
                })
            );
        })
    }

    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 bg-gray-800 bg-opacity-50 h-full transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="w-screen laptop:w-[585px] h-full bg-white p-[48px] px-[20px]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                Guest details
                            </p>
                        </div>
                        <div>
                            <CloseIcon className="cursor-pointer" onClick={toggleMenu}/>
                        </div>
                    </div>
                    {
                        loading ? (
                            <GuestDetailSkeleton/>
                        ) : (
                            <div className="relative flex flex-col px-[64px] py-[24px] gap-[24px] mt-4 overflow-hidden">
                                {
                                    guestDetails?.checked_in && (
                                        <div
                                            className="absolute top-20 right-0 w-[120px] h-[32px] bg-red-600 text-white text-[12px] font-semibold flex items-center justify-center rotate-45 origin-top-right translate-x-[30px] -translate-y-[20px] shadow-md">
                                            VOID
                                        </div>
                                    )
                                }
                                <p className={'text-[20px] font-semiBold'}>
                                    {guestDetails?.event?.name}
                                </p>
                                <div className={'flex items-center gap-[4px]'}>
                                    <CalendarIcon className={'w-4 h-4'}/>
                                    <p className={'text-text-grey font-normal'}>{guestDetails?.event?.start_date}</p>
                                    <DotIcon className={'w-1 h-1'}/>
                                    <p className={'text-text-grey font-normal'}>{guestDetails?.event?.start_time} - {guestDetails?.event?.end_time}</p>
                                </div>
                                <div className={'flex justify-between'}>
                                    <div className={'flex flex-col text-left'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Guest name</p>
                                        <p className={'font-medium text-[14px] text-light-black'}>{guestDetails?.user?.name}</p>
                                    </div>
                                    <div className={'flex flex-col text-right'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Ticket ID</p>
                                        <p className={'font-medium text-[14px] text-light-black'}>
                                            {guestDetails?.ticket?.ticket_id.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div className={'flex justify-between'}>
                                    <div className={'flex flex-col text-left'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Email address</p>
                                        <p className={'font-medium text-[14px] text-light-black'}>
                                            {guestDetails?.user?.email}
                                        </p>
                                    </div>
                                    <div className={'flex flex-col text-right'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Ticket type</p>
                                        <p className={'font-medium text-[14px] text-light-black'}>
                                            {formatStringUCFirst(guestDetails?.ticket?.type)}
                                        </p>
                                    </div>
                                </div>

                                <div className={'flex justify-between'}>
                                    <div className={'flex flex-col text-left'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Check in status</p>
                                        {
                                            guestDetails?.checked_in ? (
                                                <div
                                                    className={'px-[8px] py-[2px] rounded-[12px] flex items-center gap-[4px] bg-light-green-60 justify-center'}>
                                                    <CheckIcon
                                                        className="w-[10px] h-[9px] text-light-green-70 stroke-current"/>
                                                    <p className={'font-medium text-[14px] text-light-green-70'}>Checked
                                                        In</p>
                                                </div>
                                            ) : (
                                                <div
                                                    className={'px-[8px] py-[2px] rounded-[12px] flex items-center gap-[4px] bg-warning justify-center'}>
                                                    <ClockIcon/>
                                                    <p className={'font-medium text-[14px] text-warning-bold'}>Pending</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={'flex flex-col text-right'}>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Checked in</p>
                                        <p className={'font-medium text-[14px] text-light-black'}>
                                            0/1 tickets
                                        </p>
                                    </div>
                                </div>

                                {
                                    !guestDetails?.checked_in && (
                                        <button
                                            className={'bg-gradient-green h-[48px] text-white rounded-[12px] shadow-event-custom flex justify-center items-center'}
                                            type={'button'}
                                            onClick={handleCheckInGuest}
                                            disabled={checkInLoading}
                                        >
                                            {
                                                checkInLoading ? (
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
                                                    <p className={'text-[16px] font-medium'}>Check in</p>
                                                )
                                            }
                                        </button>
                                    )
                                }

                            </div>
                        )
                    }
                </div>
            </div>
            {
                isOpen && (
                    <div
                        className={`fixed z-10 inset-0 transition-all duration-300 ${
                            isOpen ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-transparent'
                        }`}
                        onClick={toggleMenu}
                    ></div>
                )
            }
            <CheckedInModal toggle={toggleModal} isOpen={checkedInOpen} guestDetails={guestDetails}/>
        </>
    );
};

export default GuestSideMenu;