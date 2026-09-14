import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/dot.svg";
import ClockIcon from "@/images/icons/clock-orange.svg";
import { GuestDetailSkeleton } from "@/components/Skeletons";
import { formatStringUCFirst } from "@/lib/helper";
import { useAppDispatch } from "@/redux/hook";
import CheckedInModal from "@/components/events/Modals/CheckedInModal";
import { useCheckInGuestMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { ColorRing } from "react-loader-spinner";
import CheckIcon from "@/images/icons/checkedFilledIcon.svg";

type SideMenuInterface = {
  toggleMenu: () => void;
  isOpen: boolean;
  guestDetails: any;
  loading: boolean;
  id: number;
};

const GuestSideMenu: React.FC<SideMenuInterface> = ({
  toggleMenu,
  isOpen,
  guestDetails,
  loading,
  id,
}) => {
  const dispatch = useAppDispatch();
  const checkInGuestMutation = useCheckInGuestMutation(id);
  const checkInLoading = checkInGuestMutation.isPending;
  const [checkedInOpen, setCheckedInOpen] = useState(false);

  const toggleModal = () => {
    setCheckedInOpen(!checkedInOpen);
  };

  const handleCheckInGuest = () => {
    checkInGuestMutation.mutate(guestDetails?.id, {
      onSuccess: () => {
        // toggleMenu()
        toggleModal();
      },
      onError: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `There was an error while checking the guest is`,
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-full transform bg-gray-800 bg-opacity-50 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full w-screen bg-white p-[48px] px-[20px] laptop:w-[585px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
                Guest details
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          {loading ? (
            <GuestDetailSkeleton />
          ) : (
            <div className="relative mt-4 flex flex-col gap-[24px] overflow-hidden px-[64px] py-[24px]">
              {guestDetails?.checked_in && (
                <div className="absolute right-0 top-20 flex h-[32px] w-[120px] origin-top-right -translate-y-[20px] translate-x-[30px] rotate-45 items-center justify-center bg-red-600 text-[12px] font-semibold text-white shadow-md">
                  VOID
                </div>
              )}
              <p className={"text-[20px] font-semiBold"}>{guestDetails?.event?.name}</p>
              <div className={"flex items-center gap-[4px]"}>
                <CalendarIcon className={"h-4 w-4"} />
                <p className={"font-normal text-text-grey"}>{guestDetails?.event?.start_date}</p>
                <DotIcon className={"h-1 w-1"} />
                <p className={"font-normal text-text-grey"}>
                  {guestDetails?.event?.start_time} - {guestDetails?.event?.end_time}
                </p>
              </div>
              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Guest name</p>
                  <p className={"text-[14px] font-medium text-light-black"}>
                    {guestDetails?.user?.name}
                  </p>
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Ticket ID</p>
                  <p className={"text-[14px] font-medium text-light-black"}>
                    {guestDetails?.ticket?.ticket_id.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Email address</p>
                  <p className={"text-[14px] font-medium text-light-black"}>
                    {guestDetails?.user?.email}
                  </p>
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Ticket type</p>
                  <p className={"text-[14px] font-medium text-light-black"}>
                    {formatStringUCFirst(guestDetails?.ticket?.ticket_name)}
                  </p>
                </div>
              </div>

              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Check in status</p>
                  {guestDetails?.checked_in ? (
                    <div
                      className={
                        "flex items-center justify-center gap-[4px] rounded-[12px] bg-light-green-60 px-[8px] py-[2px]"
                      }
                    >
                      <CheckIcon className="h-[9px] w-[10px] stroke-current text-light-green-70" />
                      <p className={"text-[14px] font-medium text-light-green-70"}>Checked In</p>
                    </div>
                  ) : (
                    <div
                      className={
                        "flex items-center justify-center gap-[4px] rounded-[12px] bg-warning px-[8px] py-[2px]"
                      }
                    >
                      <ClockIcon />
                      <p className={"text-[14px] font-medium text-warning-bold"}>Not Checked In</p>
                    </div>
                  )}
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>Checked in</p>
                  <p className={"text-[14px] font-medium text-light-black"}>0/1 tickets</p>
                </div>
              </div>

              {!guestDetails?.checked_in && (
                <button
                  className={`flex h-[48px] items-center justify-center rounded-[12px] bg-gradient-green text-white shadow-green-inset hover:shadow-green-inset-strong ${checkInLoading && "cursor-not-allowed opacity-50"} `}
                  type={"button"}
                  onClick={handleCheckInGuest}
                  disabled={checkInLoading}
                >
                  {checkInLoading ? (
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
                    <p className={"text-[16px] font-medium"}>Check in</p>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
      <CheckedInModal toggle={toggleModal} isOpen={checkedInOpen} guestDetails={guestDetails} />
    </>
  );
};

export default GuestSideMenu;
