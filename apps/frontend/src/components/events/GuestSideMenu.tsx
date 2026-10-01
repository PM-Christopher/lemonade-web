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

export interface GuestDetails {
  id?: number;
  checked_in?: boolean;
  event?: { name?: string; start_date?: string; start_time?: string; end_time?: string };
  user?: { name?: string; email?: string };
  ticket?: { ticket_id?: string; ticket_name?: string };
}

type SideMenuInterface = {
  toggleMenu: () => void;
  isOpen: boolean;
  guestDetails: GuestDetails;
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
    checkInGuestMutation.mutate(guestDetails?.id as number, {
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
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform bg-gray-800 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="laptop:w-[585px] h-full w-screen bg-white p-12 px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
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
            <div className="relative mt-4 flex flex-col gap-6 overflow-hidden px-16 py-6">
              {guestDetails?.checked_in && (
                <div className="absolute top-20 right-0 flex h-8 w-[120px] origin-top-right translate-x-[30px] -translate-y-5 rotate-45 items-center justify-center bg-red-600 text-[12px] font-semibold text-white shadow-md">
                  VOID
                </div>
              )}
              <p className={"font-semiBold text-[20px]"}>{guestDetails?.event?.name}</p>
              <div className={"flex items-center gap-1"}>
                <CalendarIcon className={"h-4 w-4"} />
                <p className={"text-text-grey font-normal"}>{guestDetails?.event?.start_date}</p>
                <DotIcon className={"h-1 w-1"} />
                <p className={"text-text-grey font-normal"}>
                  {guestDetails?.event?.start_time} - {guestDetails?.event?.end_time}
                </p>
              </div>
              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Guest name</p>
                  <p className={"text-light-black text-[14px] font-medium"}>
                    {guestDetails?.user?.name}
                  </p>
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Ticket ID</p>
                  <p className={"text-light-black text-[14px] font-medium"}>
                    {guestDetails?.ticket?.ticket_id?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Email address</p>
                  <p className={"text-light-black text-[14px] font-medium"}>
                    {guestDetails?.user?.email}
                  </p>
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Ticket type</p>
                  <p className={"text-light-black text-[14px] font-medium"}>
                    {formatStringUCFirst(guestDetails?.ticket?.ticket_name)}
                  </p>
                </div>
              </div>

              <div className={"flex justify-between"}>
                <div className={"flex flex-col text-left"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Check in status</p>
                  {guestDetails?.checked_in ? (
                    <div
                      className={
                        "bg-light-green-60 flex items-center justify-center gap-1 rounded-xl px-2 py-0.5"
                      }
                    >
                      <CheckIcon className="text-light-green-70 h-[9px] w-2.5 stroke-current" />
                      <p className={"text-light-green-70 text-[14px] font-medium"}>Checked In</p>
                    </div>
                  ) : (
                    <div
                      className={
                        "bg-warning flex items-center justify-center gap-1 rounded-xl px-2 py-0.5"
                      }
                    >
                      <ClockIcon />
                      <p className={"text-warning-bold text-[14px] font-medium"}>Not Checked In</p>
                    </div>
                  )}
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Checked in</p>
                  <p className={"text-light-black text-[14px] font-medium"}>0/1 tickets</p>
                </div>
              </div>

              {!guestDetails?.checked_in && (
                <button
                  className={`bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong flex h-12 items-center justify-center rounded-xl text-white ${checkInLoading && "cursor-not-allowed opacity-50"} `}
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
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
      <CheckedInModal toggle={toggleModal} isOpen={checkedInOpen} guestDetails={guestDetails} />
    </>
  );
};

export default GuestSideMenu;
