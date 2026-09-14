import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import LocationIcon from "@/images/icons/locationPinGreenIcon.svg";
import { Button } from "@/components/ui/button";
import { formatStringUCFirst, getDistanceFromLatLonInKm } from "@/lib/helper";
import { useAppDispatch } from "@/redux/hook";
import { useInviteResponseMutation } from "@/features/connect/mutations";
import { useSelector } from "react-redux";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type InviteInterface = {
  toggle: () => void;
  isOpen: boolean;
  invite: any;
};

const InviteModal: React.FC<InviteInterface> = ({ toggle, isOpen, invite }) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const inviteResponseMutation = useInviteResponseMutation();

  const requestAction = (action: "accepted" | "rejected") => {
    inviteResponseMutation.mutate(
      { id: invite.id, option: action },
      {
        onSuccess: (res) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: res.message,
              type: "success",
            }),
          );
          toggle();
        },
        onError: (err: any) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "visible bg-gray-800/50 opacity-100" : "invisible opacity-0"}`}
    >
      <div className="hide-scrollbar flex h-screen w-full flex-col justify-between overflow-y-auto rounded-none bg-white p-6 shadow-2xl laptop:h-auto laptop:max-h-[90vh] laptop:w-[480px] laptop:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 transition-all hover:bg-gray-100"
              onClick={toggle}
            >
              <CloseIcon className="w-[12px]" />
            </button>
            <p className="text-[16px] font-semibold text-gray-900">New Invite</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col items-center space-y-3 text-center">
          {/* Avatar */}
          <div className="relative flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full bg-gray-100">
            <Image src="/images/lemon.png" alt="lemon" fill className="object-contain" />
            <p className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-black">
              {invite?.invitee?.lemon_id_short}
            </p>
          </div>

          {/* User Info */}
          <p className="text-[18px] font-semibold text-gray-900">
            {invite?.invitee?.lemon_id_full}
          </p>
          <p className="text-[14px] text-gray-700">{invite?.invitee?.username}</p>
          {invite?.invitee?.bio && (
            <p className="text-[14px] text-gray-700">{invite?.invitee?.bio}</p>
          )}
          {invite?.invitee?.industry && (
            <p className="text-[12px] text-gray-500">
              {formatStringUCFirst(invite?.invitee?.industry)}
            </p>
          )}

          {/* Distance */}
          <div className="mt-2 flex items-center gap-2 text-[12px] text-mid-green">
            <LocationIcon />
            <p>
              {getDistanceFromLatLonInKm(
                user?.connect_info?.latitude,
                user?.connect_info?.longitude,
                invite?.location?.latitude,
                invite?.location?.longitude,
              )}{" "}
              kms away
            </p>
          </div>

          {/* Message */}
          {invite?.message && (
            <div className="mt-4 flex w-full max-w-[384px] flex-col rounded-lg bg-light_grey p-4">
              <p className="text-[12px] font-medium text-gray-500">Message</p>
              <p className="mt-1 text-[14px] text-gray-800">{invite?.message}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex w-full gap-4">
          <Button
            className="h-[48px] flex-1 rounded-lg border border-gray-300 bg-white transition-all hover:bg-gray-50"
            onClick={() => requestAction("rejected")}
          >
            <p className="text-[16px] font-medium text-gray-900">Reject Invite</p>
          </Button>
          <Button
            className="h-[48px] flex-1 rounded-lg bg-gradient-green shadow-lg transition-all hover:brightness-105"
            onClick={() => requestAction("accepted")}
          >
            <p className="text-[16px] font-medium">Accept Invite</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
